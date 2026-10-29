import os
import re
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from typing import Optional
from app.services.storage_service import storage_service
from app.db import repository
from app.core.config import settings, PROJECT_ROOT

router = APIRouter()

FRONTEND_PUBLIC_DIR = os.path.join(PROJECT_ROOT, "frontend", "public")
UPLOAD_DIR = settings.UPLOAD_DIR

MIME_TYPES = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
}

def _resolve_safe_media_path(media_url: str) -> Optional[str]:
    """Safely resolve a relative or uploads media URL to an allowed local filesystem path.
    Strictly prevents path traversal, drive jumping, remote URLs, and private file access.
    """
    if not media_url or not isinstance(media_url, str):
        return None

    clean_url = media_url.strip().replace("\\", "/")

    # 1. Reject remote URLs, protocols, UNC paths, Windows drive specifiers, traversal, and null bytes
    if (
        clean_url.startswith("http://") or
        clean_url.startswith("https://") or
        clean_url.startswith("ftp://") or
        clean_url.startswith("//") or
        ":" in clean_url or
        "\0" in clean_url or
        ".." in clean_url
    ):
        return None

    # 2. Extract and validate file extension strictly against allowed media MIME types
    _, ext = os.path.splitext(clean_url)
    if not ext or ext.lower() not in MIME_TYPES:
        return None

    # 3. Determine base directory and relative subpath
    if clean_url.startswith("/uploads/") or clean_url.startswith("uploads/"):
        rel = clean_url.replace("/uploads/", "").replace("uploads/", "").lstrip("/")
        base_dir = UPLOAD_DIR
    elif (
        clean_url.startswith("/images/") or clean_url.startswith("images/") or
        clean_url.startswith("/videos/") or clean_url.startswith("videos/")
    ):
        rel = clean_url.lstrip("/")
        base_dir = FRONTEND_PUBLIC_DIR
    else:
        # Reject any file not located within uploads, images, or videos directories
        return None

    # 4. Resolve absolute paths safely and verify boundaries
    try:
        full_path = os.path.normpath(os.path.join(base_dir, rel))
        real_path = os.path.realpath(full_path)
        real_base = os.path.realpath(base_dir)

        # On Windows, verify matching drive letters
        if os.path.splitdrive(real_path)[0].lower() != os.path.splitdrive(real_base)[0].lower():
            return None

        # Verify target is strictly within base directory and is an actual file
        if os.path.commonpath([real_path, real_base]) == real_base and os.path.isfile(real_path):
            return real_path
    except (ValueError, OSError):
        return None

    return None

def _format_download_filename(prefix: str, title: str, original_path: str) -> str:
    _, ext = os.path.splitext(original_path)
    if not ext:
        ext = ".jpg"
    slug = re.sub(r"[^a-zA-Z0-9_-]", "-", title.lower()).strip("-")
    slug = re.sub(r"-+", "-", slug)
    if not slug:
        slug = "media"
    return f"lensframe-{prefix}-{slug}{ext.lower()}"

@router.get("/portfolio")
def get_portfolio(category: Optional[str] = Query(None)):
    return storage_service.get_portfolio(category)

@router.get("/albums")
def get_albums():
    return storage_service.get_albums()

@router.get("/reels")
def get_reels():
    return storage_service.get_reels()

@router.get("/packages")
def get_packages():
    return storage_service.get_packages()

@router.get("/testimonials")
def get_testimonials():
    return storage_service.get_testimonials()

@router.get("/settings/public")
def get_public_settings():
    return repository.get_public_settings()

@router.get("/download/portfolio/{item_id}")
def download_portfolio_photo(item_id: str):
    item = repository.get_portfolio_item(item_id)
    if not item and not item_id.startswith("port-"):
        item = repository.get_portfolio_item(f"port-{item_id}")
    elif not item and item_id.startswith("port-"):
        item = repository.get_portfolio_item(item_id.replace("port-", ""))

    if not item:
        raise HTTPException(status_code=404, detail="Portfolio photo not found")

    image_path_str = item.get("image") or ""
    resolved_path = _resolve_safe_media_path(image_path_str)
    if not resolved_path:
        raise HTTPException(status_code=404, detail="High-resolution image file not found on server")

    filename = _format_download_filename("portfolio", item.get("title", item_id), resolved_path)
    _, ext = os.path.splitext(resolved_path)
    media_type = MIME_TYPES.get(ext.lower(), "application/octet-stream")

    return FileResponse(
        path=resolved_path,
        filename=filename,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/download/reel/{reel_id}")
def download_reel_video(reel_id: str):
    reel = repository.get_reel_by_id(reel_id)
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")

    video_path_str = reel.get("video_url") or reel.get("videoUrl") or ""
    resolved_path = _resolve_safe_media_path(video_path_str)
    if not resolved_path:
        raise HTTPException(status_code=404, detail="Video file not available for download on server")

    filename = _format_download_filename("reel", reel.get("title", reel_id), resolved_path)
    _, ext = os.path.splitext(resolved_path)
    media_type = MIME_TYPES.get(ext.lower(), "video/mp4")

    return FileResponse(
        path=resolved_path,
        filename=filename,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/download/album/{album_id}")
def download_album_media(album_id: str, image_url: Optional[str] = Query(None)):
    album = repository.get_album_by_id(album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    # Build strict allowlist of authorized media for this album
    trusted_media = set()
    if album.get("cover") and isinstance(album["cover"], str):
        trusted_media.add(album["cover"].strip())
    raw_previews = album.get("preview_images") or []
    if isinstance(raw_previews, list):
        for img in raw_previews:
            if isinstance(img, str) and img.strip():
                trusted_media.add(img.strip())

    target_img = album.get("cover") or ""
    if image_url is not None and isinstance(image_url, str) and image_url.strip():
        clean_req_url = image_url.strip()
        if clean_req_url not in trusted_media:
            raise HTTPException(
                status_code=400,
                detail="Requested image_url is not in the trusted media allowlist for this album"
            )
        target_img = clean_req_url

    resolved_path = _resolve_safe_media_path(target_img)
    if not resolved_path:
        raise HTTPException(status_code=404, detail="Album image file not found on server")

    filename = _format_download_filename("album", album.get("title", album_id), resolved_path)
    _, ext = os.path.splitext(resolved_path)
    media_type = MIME_TYPES.get(ext.lower(), "image/jpeg")

    return FileResponse(
        path=resolved_path,
        filename=filename,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

import os
import shutil
import uuid
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, UploadFile, File, status
from fastapi.responses import PlainTextResponse
from app.api.deps import get_current_admin, require_superadmin
from app.core.config import settings
from app.core.security import hash_password
from app.db import repository
from app.models.admin import (
    AdminCreateRequest, AdminOut, AdminUpdateRequest,
    PortfolioCreate, PortfolioUpdate, PortfolioReorderRequest,
    AlbumCreate, AlbumUpdate,
    ReelCreate, ReelUpdate,
    PackageCreate, PackageUpdate,
    TestimonialCreate, TestimonialUpdate,
    BookingStatusUpdate, ContactStatusUpdate,
    SettingsUpdateRequest
)

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

ALLOWED_EXTENSIONS = {
    "image": {".jpg", ".jpeg", ".png", ".webp"},
    "video": {".mp4", ".webm"}
}

# ==================== DASHBOARD STATS ====================

@router.get("/dashboard/stats")
def get_dashboard_statistics(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return repository.get_dashboard_stats()

# ==================== PORTFOLIO CRUD ====================

@router.get("/portfolio")
def list_portfolio_admin(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    items, total = repository.get_portfolio(category=category, search=search, page=page, page_size=page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.post("/portfolio", status_code=status.HTTP_201_CREATED)
def create_portfolio_item(
    payload: PortfolioCreate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    item_id = repository.create_portfolio_item(payload.model_dump())
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE",
        entity_type="portfolio",
        entity_id=item_id,
        details=f"Added portfolio item: {payload.title}"
    )
    return {"success": True, "id": item_id, "message": "Portfolio photo added successfully."}

@router.put("/portfolio/{item_id}")
def update_portfolio_item(
    item_id: str,
    payload: PortfolioUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_portfolio_item(item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Portfolio photo not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_portfolio_item(item_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="portfolio",
        entity_id=item_id,
        details=f"Updated portfolio item: {existing.get('title')}"
    )
    return {"success": True, "message": "Portfolio photo updated successfully."}

@router.delete("/portfolio/{item_id}")
def delete_portfolio_item(
    item_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_portfolio_item(item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Portfolio photo not found.")
    
    repository.delete_portfolio_item(item_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="portfolio",
        entity_id=item_id,
        details=f"Deleted portfolio photo: {existing.get('title')}"
    )
    return {"success": True, "message": "Portfolio photo deleted."}

@router.post("/portfolio/reorder")
def reorder_portfolio_items(
    payload: PortfolioReorderRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    repository.reorder_portfolio(payload.ordered_ids)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="REORDER",
        entity_type="portfolio",
        details=f"Reordered {len(payload.ordered_ids)} portfolio items"
    )
    return {"success": True, "message": "Portfolio order updated."}

# ==================== ALBUMS CRUD ====================

@router.get("/albums")
def list_albums_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return repository.get_albums_admin()

@router.post("/albums", status_code=status.HTTP_201_CREATED)
def create_album(
    payload: AlbumCreate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    album_id = repository.create_album(payload.model_dump())
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE",
        entity_type="album",
        entity_id=album_id,
        details=f"Created album: {payload.title}"
    )
    return {"success": True, "id": album_id, "message": "Album created successfully."}

@router.put("/albums/{album_id}")
def update_album(
    album_id: str,
    payload: AlbumUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_album_by_id(album_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Album not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_album(album_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="album",
        entity_id=album_id,
        details=f"Updated album: {existing.get('title')}"
    )
    return {"success": True, "message": "Album updated successfully."}

@router.delete("/albums/{album_id}")
def delete_album(
    album_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_album_by_id(album_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Album not found.")
    
    repository.delete_album(album_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="album",
        entity_id=album_id,
        details=f"Deleted album: {existing.get('title')}"
    )
    return {"success": True, "message": "Album deleted safely."}

# ==================== REELS CRUD ====================

@router.get("/reels")
def list_reels_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return repository.get_reels(only_visible=False)

@router.post("/reels", status_code=status.HTTP_201_CREATED)
def create_reel(
    payload: ReelCreate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    reel_id = repository.create_reel(payload.model_dump())
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE",
        entity_type="reel",
        entity_id=reel_id,
        details=f"Added reel: {payload.title}"
    )
    return {"success": True, "id": reel_id, "message": "Reel created successfully."}

@router.put("/reels/{reel_id}")
def update_reel(
    reel_id: str,
    payload: ReelUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_reel_by_id(reel_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Reel not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_reel(reel_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="reel",
        entity_id=reel_id,
        details=f"Updated reel: {existing.get('title')}"
    )
    return {"success": True, "message": "Reel updated successfully."}

@router.delete("/reels/{reel_id}")
def delete_reel(
    reel_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_reel_by_id(reel_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Reel not found.")
    
    repository.delete_reel(reel_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="reel",
        entity_id=reel_id,
        details=f"Deleted reel: {existing.get('title')}"
    )
    return {"success": True, "message": "Reel deleted."}

# ==================== PACKAGES CRUD ====================

@router.get("/packages")
def list_packages_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return repository.get_packages(only_active=False)

@router.post("/packages", status_code=status.HTTP_201_CREATED)
def create_package(
    payload: PackageCreate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    pkg_id = repository.create_package(payload.model_dump())
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE",
        entity_type="package",
        entity_id=pkg_id,
        details=f"Created package: {payload.name}"
    )
    return {"success": True, "id": pkg_id, "message": "Package created successfully."}

@router.put("/packages/{pkg_id}")
def update_package(
    pkg_id: str,
    payload: PackageUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_package_by_id(pkg_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Package not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_package(pkg_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="package",
        entity_id=pkg_id,
        details=f"Updated package: {existing.get('name')}"
    )
    return {"success": True, "message": "Package updated successfully."}

@router.delete("/packages/{pkg_id}")
def delete_package(
    pkg_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_package_by_id(pkg_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Package not found.")
    
    repository.delete_package(pkg_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="package",
        entity_id=pkg_id,
        details=f"Deleted package: {existing.get('name')}"
    )
    return {"success": True, "message": "Package deleted."}

# ==================== TESTIMONIALS CRUD ====================

@router.get("/testimonials")
def list_testimonials_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return repository.get_testimonials(only_approved=False)

@router.post("/testimonials", status_code=status.HTTP_201_CREATED)
def create_testimonial(
    payload: TestimonialCreate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    test_id = repository.create_testimonial(payload.model_dump())
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE",
        entity_type="testimonial",
        entity_id=test_id,
        details=f"Added testimonial from: {payload.name}"
    )
    return {"success": True, "id": test_id, "message": "Testimonial added successfully."}

@router.put("/testimonials/{test_id}")
def update_testimonial(
    test_id: str,
    payload: TestimonialUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_testimonial_by_id(test_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_testimonial(test_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="testimonial",
        entity_id=test_id,
        details=f"Updated testimonial: {existing.get('name')}"
    )
    return {"success": True, "message": "Testimonial updated."}

@router.delete("/testimonials/{test_id}")
def delete_testimonial(
    test_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_testimonial_by_id(test_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found.")
    
    repository.delete_testimonial(test_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="testimonial",
        entity_id=test_id,
        details=f"Deleted testimonial: {existing.get('name')}"
    )
    return {"success": True, "message": "Testimonial deleted."}

# ==================== BOOKINGS MANAGEMENT ====================

@router.get("/bookings")
def list_bookings_admin(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    items, total = repository.get_bookings(status=status, search=search, page=page, page_size=page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.get("/bookings/{booking_id}")
def get_booking_details(
    booking_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    booking = repository.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking record not found.")
    return booking

@router.put("/bookings/{booking_id}")
def update_booking_details(
    booking_id: str,
    payload: BookingStatusUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_booking_by_id(booking_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Booking record not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    repository.update_booking(booking_id, updates)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE",
        entity_type="booking",
        entity_id=booking_id,
        details=f"Updated booking status to: {payload.status or 'modified'}"
    )
    return {"success": True, "message": "Booking record updated successfully."}

@router.delete("/bookings/{booking_id}")
def delete_booking_record(
    booking_id: str,
    current_admin: Dict[str, Any] = Depends(require_superadmin)
):
    existing = repository.get_booking_by_id(booking_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Booking record not found.")
    
    repository.delete_booking(booking_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="booking",
        entity_id=booking_id,
        details=f"Deleted booking for: {existing.get('full_name')}"
    )
    return {"success": True, "message": "Booking record removed."}

@router.get("/bookings/export/csv")
def export_bookings_csv_file(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    csv_data = repository.export_bookings_csv()
    repository.log_activity(
        admin_username=current_admin["username"],
        action="EXPORT_CSV",
        entity_type="booking",
        details="Exported bookings CSV dataset"
    )
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=lensframe_bookings.csv"}
    )

# ==================== CONTACT MESSAGES ====================

@router.get("/contacts")
def list_contacts_admin(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    items, total = repository.get_contacts(status=status, search=search, page=page, page_size=page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.get("/contacts/{contact_id}")
def get_contact_details(
    contact_id: int,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    item = repository.get_contact_by_id(contact_id)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found.")
    return item

@router.put("/contacts/{contact_id}")
def update_contact_details(
    contact_id: int,
    payload: ContactStatusUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_contact_by_id(contact_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Message not found.")
    
    updates = {}
    if payload.status is not None:
        updates["status"] = payload.status
    if payload.is_read is not None:
        updates["is_read"] = 1 if payload.is_read else 0
    if payload.internal_notes is not None:
        updates["internal_notes"] = payload.internal_notes
    
    repository.update_contact(contact_id, updates)
    return {"success": True, "message": "Message status updated."}

@router.delete("/contacts/{contact_id}")
def delete_contact_message(
    contact_id: int,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    existing = repository.get_contact_by_id(contact_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Message not found.")
    
    repository.delete_contact(contact_id)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE",
        entity_type="contact",
        entity_id=str(contact_id),
        details=f"Deleted message from: {existing.get('name')}"
    )
    return {"success": True, "message": "Contact enquiry deleted."}

# ==================== ADMIN USERS MANAGEMENT ====================

@router.get("/users", response_model=List[AdminOut])
def list_admin_users(current_admin: Dict[str, Any] = Depends(require_superadmin)):
    admins = repository.get_admins()
    return [
        AdminOut(
            id=a["id"],
            username=a["username"],
            email=a["email"],
            role=a["role"],
            full_name=a.get("full_name") or "",
            is_active=bool(a.get("is_active")),
            created_at=a["created_at"],
            last_login=a.get("last_login")
        )
        for a in admins
    ]

@router.post("/users", status_code=status.HTTP_201_CREATED, response_model=AdminOut)
def create_admin_user(
    payload: AdminCreateRequest,
    current_admin: Dict[str, Any] = Depends(require_superadmin)
):
    existing = repository.get_admin_by_username(payload.username.strip())
    if existing:
        raise HTTPException(status_code=400, detail="Username is already registered.")
    
    pwd_hash = hash_password(payload.password)
    new_id = repository.create_admin(
        username=payload.username.strip(),
        email=payload.email,
        password_hash=pwd_hash,
        role=payload.role,
        full_name=payload.full_name
    )
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CREATE_ADMIN",
        entity_type="user",
        entity_id=str(new_id),
        details=f"Created administrator account: {payload.username} ({payload.role})"
    )
    admin = repository.get_admin_by_id(new_id)
    return AdminOut(
        id=admin["id"],
        username=admin["username"],
        email=admin["email"],
        role=admin["role"],
        full_name=admin.get("full_name") or "",
        is_active=bool(admin.get("is_active")),
        created_at=admin["created_at"],
        last_login=admin.get("last_login")
    )

@router.put("/users/{user_id}")
def update_admin_user(
    user_id: int,
    payload: AdminUpdateRequest,
    current_admin: Dict[str, Any] = Depends(require_superadmin)
):
    target = repository.get_admin_by_id(user_id)
    if not target:
        raise HTTPException(status_code=404, detail="Admin user not found.")
    
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "is_active" in updates:
        updates["is_active"] = 1 if updates["is_active"] else 0
    
    try:
        repository.update_admin(user_id, updates)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE_ADMIN",
        entity_type="user",
        entity_id=str(user_id),
        details=f"Updated administrator attributes for: {target.get('username')}"
    )
    return {"success": True, "message": "Admin user profile updated."}

@router.delete("/users/{user_id}")
def delete_admin_user(
    user_id: int,
    current_admin: Dict[str, Any] = Depends(require_superadmin)
):
    if user_id == current_admin["id"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own active administrator account.")
    
    target = repository.get_admin_by_id(user_id)
    if not target:
        raise HTTPException(status_code=404, detail="Admin user not found.")
    
    try:
        repository.delete_admin(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    repository.log_activity(
        admin_username=current_admin["username"],
        action="DELETE_ADMIN",
        entity_type="user",
        entity_id=str(user_id),
        details=f"Removed administrator: {target.get('username')}"
    )
    return {"success": True, "message": "Admin user removed."}

# ==================== WEBSITE SETTINGS ====================

@router.get("/settings")
def get_all_settings(
    category: Optional[str] = Query(None),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    return repository.get_settings(category=category)

@router.put("/settings")
def update_website_settings(
    payload: SettingsUpdateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    repository.update_settings(payload.settings, payload.category)
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPDATE_SETTINGS",
        entity_type="settings",
        entity_id=payload.category,
        details=f"Updated {payload.category} website settings"
    )
    return {"success": True, "message": f"{payload.category.capitalize()} settings saved successfully."}

# ==================== ACTIVITY AUDIT ====================

@router.get("/activity")
def get_activity_log(
    limit: int = Query(30, ge=1, le=100),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    return repository.get_recent_activity_logs(limit=limit)

# ==================== MEDIA UPLOADER ====================

def _validate_media_magic_bytes(file_bytes: bytes, ext: str) -> bool:
    if len(file_bytes) < 4:
        return False
    ext = ext.lower()
    if ext in [".jpg", ".jpeg"]:
        return file_bytes.startswith(b"\xff\xd8\xff")
    if ext == ".png":
        return file_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    if ext == ".webp":
        return file_bytes.startswith(b"RIFF") and b"WEBP" in file_bytes[:16]
    if ext in [".mp4", ".mov"]:
        if b"moov" in file_bytes[:32]:
            return True
        if b"ftyp" in file_bytes[:16]:
            idx = file_bytes.find(b"ftyp")
            brand = file_bytes[idx+4:idx+8]
            valid_brands = [b"isom", b"iso2", b"mp41", b"mp42", b"qt  ", b"M4V ", b"dash", b"avc1"]
            return any(brand.startswith(vb[:3]) for vb in valid_brands)
        return False
    if ext == ".webm":
        return file_bytes.startswith(b"\x1a\x45\xdf\xa3") and len(file_bytes) >= 12 and (b"webm" in file_bytes[:64] or b"matroska" in file_bytes[:64])
    return True

@router.post("/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    # Extension check
    filename = file.filename or "media_upload"
    ext = os.path.splitext(filename)[1].lower()
    
    is_image = ext in ALLOWED_EXTENSIONS["image"]
    is_video = ext in ALLOWED_EXTENSIONS["video"]

    if not is_image and not is_video:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS['image'] | ALLOWED_EXTENSIONS['video'])}"
        )

    # Size check
    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Magic bytes check to prevent MIME-spoofing and disguised scripts
    if not _validate_media_magic_bytes(file_bytes, ext):
        raise HTTPException(
            status_code=400,
            detail=f"Corrupted or invalid {ext} file content. Magic bytes signature does not match declared extension."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex[:12]}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(dest_path, "wb") as buffer:
        buffer.write(file_bytes)

    # Return public relative path
    file_url = f"/uploads/{unique_filename}"
    
    repository.log_activity(
        admin_username=current_admin["username"],
        action="UPLOAD",
        entity_type="media",
        entity_id=unique_filename,
        details=f"Uploaded {ext} file: {filename} ({round(len(file_bytes) / 1024, 1)} KB)"
    )

    return {
        "success": True,
        "url": file_url,
        "filename": unique_filename,
        "original_name": filename,
        "size": len(file_bytes),
        "is_image": is_image,
        "is_video": is_video
    }


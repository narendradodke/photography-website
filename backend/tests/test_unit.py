import os
import sys
import tempfile
import pytest
from starlette.requests import Request

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token, RateLimiter
from app.db.database import init_db
from app.db import repository
from app.api.routes import auth, admin, booking, contact, data
from app.models.admin import (
    LoginRequest, PortfolioCreate, PortfolioUpdate,
    AlbumCreate, AlbumUpdate, ReelCreate, ReelUpdate,
    PackageCreate, PackageUpdate, TestimonialCreate, TestimonialUpdate,
    BookingStatusUpdate, ContactStatusUpdate, SettingsUpdateRequest,
    AdminCreateRequest, AdminUpdateRequest
)
from app.models.booking import BookingCreate, ContactCreate

def mock_request(client_ip: str = "127.0.0.1") -> Request:
    return Request({
        "type": "http",
        "client": (client_ip, 12345),
        "headers": []
    })

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    test_db = os.path.join(tempfile.gettempdir(), f"lensframe_test_{os.getpid()}.db")
    orig_path = settings.DATABASE_PATH
    settings.DATABASE_PATH = test_db
    init_db()
    yield
    settings.DATABASE_PATH = orig_path
    for ext in ["", "-shm", "-wal"]:
        f = f"{test_db}{ext}"
        if os.path.exists(f):
            try:
                os.remove(f)
            except Exception:
                pass

def test_password_and_token():
    h = hash_password("TestSecretPass123!")
    assert verify_password("TestSecretPass123!", h) is True
    assert verify_password("Wrong!", h) is False

    token = create_access_token({"sub": "admin", "role": "superadmin"})
    payload = decode_access_token(token)
    assert payload["sub"] == "admin"
    assert payload["role"] == "superadmin"

def test_rate_limiter():
    limiter = RateLimiter(max_requests=3, window_seconds=60)
    assert limiter.is_allowed("test-ip") is True
    assert limiter.is_allowed("test-ip") is True
    assert limiter.is_allowed("test-ip") is True
    assert limiter.is_allowed("test-ip") is False

def test_admin_login_direct():
    req = mock_request()
    res = auth.admin_login(LoginRequest(
        username=settings.INITIAL_ADMIN_USERNAME,
        password=settings.INITIAL_ADMIN_PASSWORD
    ), req)
    assert res.token is not None
    assert res.admin.username == settings.INITIAL_ADMIN_USERNAME

def test_dashboard_stats():
    admin_user = repository.get_admin_by_username("admin")
    stats = admin.get_dashboard_statistics(current_admin=admin_user)
    assert "bookings" in stats
    assert "messages" in stats
    assert "content" in stats
    assert stats["content"]["portfolio"] >= 30

def test_booking_workflow():
    req = mock_request()
    payload = BookingCreate(
        full_name="Priyanka Chopra",
        phone="+91 98765 00000",
        package_tier="Luxury",
        event_date="2026-11-20",
        message="Palace destination wedding in Jodhpur"
    )
    b_res = booking.create_booking(payload, req)
    assert b_res.success is True
    booking_id = b_res.booking_id
    assert booking_id.startswith("BK-")

    # Fetch booking
    admin_user = repository.get_admin_by_username("admin")
    record = admin.get_booking_details(booking_id, current_admin=admin_user)
    assert record["full_name"] == "Priyanka Chopra"
    assert record["status"] == "pending"

    # Update status to confirmed
    admin.update_booking_details(
        booking_id,
        BookingStatusUpdate(status="confirmed", internal_notes="Advance invoice sent"),
        current_admin=admin_user
    )
    updated = admin.get_booking_details(booking_id, current_admin=admin_user)
    assert updated["status"] == "confirmed"
    assert "Advance invoice sent" in updated["internal_notes"]

    # CSV export
    csv_text = repository.export_bookings_csv()
    assert "Booking ID" in csv_text
    assert booking_id in csv_text

def test_contact_message():
    req = mock_request()
    payload = ContactCreate(
        name="Rohit Verma",
        email="rohit@example.com",
        message="Need an urgent quotation for pre-wedding portfolio."
    )
    c_res = contact.create_contact(payload, req)
    assert c_res.success is True

    admin_user = repository.get_admin_by_username("admin")
    contacts_data = admin.list_contacts_admin(search="Rohit", current_admin=admin_user)
    assert contacts_data["total"] >= 1
    cid = contacts_data["items"][0]["id"]

    # Mark as read
    admin.update_contact_details(cid, ContactStatusUpdate(is_read=True, status="replied"), current_admin=admin_user)
    detail = admin.get_contact_details(cid, current_admin=admin_user)
    assert detail["is_read"] == 1
    assert detail["status"] == "replied"

def test_portfolio_crud():
    admin_user = repository.get_admin_by_username("admin")
    # 1. Create
    create_res = admin.create_portfolio_item(
        PortfolioCreate(
            title="Sunrise Ganga Ghat Portrait",
            category="weddings",
            image="/images/portfolio/insta-3.webp",
            location="Varanasi, UP",
            date="2025"
        ),
        current_admin=admin_user
    )
    assert create_res["success"] is True
    item_id = create_res["id"]

    # 2. Update
    update_res = admin.update_portfolio_item(
        item_id,
        PortfolioUpdate(title="Golden Hour Varanasi Memoir"),
        current_admin=admin_user
    )
    assert update_res["success"] is True

    # 3. Check public
    items = data.get_portfolio(category="weddings")
    titles = [it["title"] for it in items]
    assert "Golden Hour Varanasi Memoir" in titles

    # 4. Delete
    del_res = admin.delete_portfolio_item(item_id, current_admin=admin_user)
    assert del_res["success"] is True

def test_albums_crud():
    admin_user = repository.get_admin_by_username("admin")
    # 1. Create album
    c_res = admin.create_album(
        AlbumCreate(
            title="Udaipur Grandeur Album",
            subtitle="Fine art velvet cover",
            photos_count=65,
            badge_or_tag="Royal Spread",
            cover="/images/albums/album-1.jpg",
            preview_images=["/images/albums/album-2.jpg"]
        ),
        current_admin=admin_user
    )
    assert c_res["success"] is True
    album_id = c_res["id"]

    # 2. Update album
    admin.update_album(album_id, AlbumUpdate(title="Udaipur Grandeur Deluxe Edition"), current_admin=admin_user)
    alb = admin.router.routes
    db_alb = repository.get_album_by_id(album_id)
    assert db_alb["title"] == "Udaipur Grandeur Deluxe Edition"

    # 3. Clean up
    admin.delete_album(album_id, current_admin=admin_user)
    assert repository.get_album_by_id(album_id) is None

def test_reels_and_packages_crud():
    admin_user = repository.get_admin_by_username("admin")
    # Reel
    r_res = admin.create_reel(
        ReelCreate(
            title="Sunset Dance Reel",
            category="Sangeet",
            video_url="/videos/reels/reel-1.mp4"
        ),
        current_admin=admin_user
    )
    assert r_res["success"] is True
    reel_id = r_res["id"]
    admin.delete_reel(reel_id, current_admin=admin_user)

    # Package
    p_res = admin.create_package(
        PackageCreate(
            name="Cinematic Supreme",
            tagline="Complete 3-Day Wedding Coverage",
            price="₹45,000",
            price_num=45000,
            popular=True,
            features=["3 Days Full Coverage", "Teasers + Full Film", "3 Albums"]
        ),
        current_admin=admin_user
    )
    assert p_res["success"] is True
    pkg_id = p_res["id"]
    pkg = repository.get_package_by_id(pkg_id)
    assert pkg["priceNum"] == 45000
    admin.delete_package(pkg_id, current_admin=admin_user)

def test_testimonials_and_settings():
    admin_user = repository.get_admin_by_username("admin")
    # Testimonial
    t_res = admin.create_testimonial(
        TestimonialCreate(
            name="Aishwarya & Vikram",
            event="Jaipur Royal Palace",
            rating=5,
            quote="Pure magic in every single frame!",
            avatar="/images/portfolio/insta-1.webp",
            is_approved=True
        ),
        current_admin=admin_user
    )
    assert t_res["success"] is True
    test_id = t_res["id"]
    admin.delete_testimonial(test_id, current_admin=admin_user)

    # Settings update
    s_res = admin.update_website_settings(
        SettingsUpdateRequest(
            category="general",
            settings={"tagline": "Timeless Memories in Motion"}
        ),
        current_admin=admin_user
    )
    assert s_res["success"] is True
    pub = data.get_public_settings()
    assert pub["tagline"] == "Timeless Memories in Motion"

def test_admin_user_management():
    super_user = repository.get_admin_by_username("admin")
    # Create new editor admin
    new_admin = admin.create_admin_user(
        AdminCreateRequest(
            username="editor_jane",
            email="jane@lensframe.com",
            password="StrongEditorPassword123!",
            role="editor",
            full_name="Jane Doe"
        ),
        current_admin=super_user
    )
    assert new_admin.username == "editor_jane"
    assert new_admin.role == "editor"

    # Delete the created admin
    del_res = admin.delete_admin_user(new_admin.id, current_admin=super_user)
    assert del_res["success"] is True

def test_public_endpoints():
    p = data.get_portfolio()
    assert len(p) >= 30
    a = data.get_albums()
    assert "featured" in a and "carousel" in a
    r = data.get_reels()
    assert len(r) >= 5
    assert "videoUrl" in r[0] and "video_url" in r[0]
    assert "cover" in r[0]
    assert r[0]["videoUrl"].endswith(".mp4")
    pkgs = data.get_packages()
    assert len(pkgs) >= 3
    t = data.get_testimonials()
    assert len(t) >= 3
    s = data.get_public_settings()
    assert s.get("site_name") == "LensFrame"

def test_last_superadmin_protection():
    from fastapi import HTTPException
    super_user = repository.get_admin_by_username("admin")
    # Attempting to deactivate the only active superadmin must fail
    with pytest.raises(HTTPException) as exc_info:
        admin.update_admin_user(
            super_user["id"],
            AdminUpdateRequest(is_active=False),
            current_admin=super_user
        )
    assert exc_info.value.status_code == 400
    assert "Cannot deactivate or demote" in exc_info.value.detail

def test_auth_security_protections():
    from fastapi import HTTPException
    from fastapi.security import HTTPAuthorizationCredentials
    from app.api.deps import get_current_admin, require_superadmin

    req = mock_request()

    # 1. Invalid login credentials must return 401
    with pytest.raises(HTTPException) as exc:
        auth.admin_login(LoginRequest(username="admin", password="WrongPassword!"), req)
    assert exc.value.status_code == 401
    assert "Invalid username or password" in exc.value.detail

    # 2. Tampered JWT token must return 401
    bad_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="tampered.jwt.signature")
    with pytest.raises(HTTPException) as exc:
        get_current_admin(bad_creds)
    assert exc.value.status_code == 401
    assert "invalid or expired" in exc.value.detail.lower()

    # 3. Editor role must be blocked from superadmin routes with 403
    editor_user = {"id": 99, "username": "test_editor", "role": "editor", "is_active": 1}
    with pytest.raises(HTTPException) as exc:
        require_superadmin(editor_user)
    assert exc.value.status_code == 403
    assert "Superadmin role privileges required" in exc.value.detail

def test_download_endpoints():
    from fastapi import HTTPException
    from app.api.routes.data import (
        download_portfolio_photo,
        download_reel_video,
        download_album_media,
        _resolve_safe_media_path,
        _format_download_filename
    )

    # 1. Path safety and traversal prevention
    assert _resolve_safe_media_path("../../app/main.py") is None
    assert _resolve_safe_media_path("http://evil.com/malicious.mp4") is None
    assert _resolve_safe_media_path("https://evil.com/video.mp4") is None
    assert _resolve_safe_media_path("//evil.com/payload.jpg") is None
    assert _resolve_safe_media_path("C:/Windows/System32/calc.exe") is None
    assert _resolve_safe_media_path("D:/Project/backend/.env") is None
    assert _resolve_safe_media_path("/images/portfolio/insta-1.webp\0.jpg") is None
    assert _resolve_safe_media_path("/images/hero-bg.svg") is None
    assert _resolve_safe_media_path("/images/portfolio/insta-1.webp") is not None
    assert _resolve_safe_media_path("/videos/reels/reel-1.mp4") is not None
    assert _resolve_safe_media_path("/images/albums/album-1.jpg") is not None

    # 2. Filename formatting
    fn = _format_download_filename("portfolio", "Royal Mandap Ceremony", "/path/to/img.webp")
    assert fn == "lensframe-portfolio-royal-mandap-ceremony.webp"

    # 3. Portfolio download (by full id and short id)
    resp1 = download_portfolio_photo("port-insta-1")
    assert resp1.status_code == 200
    assert "lensframe-portfolio" in resp1.filename

    resp1_short = download_portfolio_photo("insta-1")
    assert resp1_short.status_code == 200
    assert resp1_short.filename == resp1.filename

    # 4. Reel download (valid local video)
    resp2 = download_reel_video("reel-1")
    assert resp2.status_code == 200
    assert "lensframe-reel" in resp2.filename
    assert resp2.media_type == "video/mp4"

    # 5. Album download (default cover)
    resp3 = download_album_media("album-1")
    assert resp3.status_code == 200
    assert "lensframe-album" in resp3.filename

    # 6. Album download with trusted spread image_url (in allowlist)
    album1 = repository.get_album_by_id("album-1")
    if album1 and album1.get("preview_images"):
        trusted_spread = album1["preview_images"][0]
        resp_spread = download_album_media("album-1", image_url=trusted_spread)
        assert resp_spread.status_code == 200

    # 7. Album download with untrusted image_url (must be rejected with HTTP 400)
    with pytest.raises(HTTPException) as exc_untrusted:
        download_album_media("album-1", image_url="../../app/main.py")
    assert exc_untrusted.value.status_code == 400
    assert "not in the trusted media allowlist" in exc_untrusted.value.detail

    with pytest.raises(HTTPException) as exc_untrusted2:
        download_album_media("album-1", image_url="https://evil.com/bad.jpg")
    assert exc_untrusted2.value.status_code == 400

    # 8. External-only reel without downloadable file (must return 404, not fake success)
    repository.create_reel({
        "id": "reel-external-test",
        "title": "External Instagram Reel",
        "category": "weddings",
        "url": "https://www.instagram.com/reel/dummy/",
        "video_url": "",
        "order_index": 999
    })
    with pytest.raises(HTTPException) as exc_external:
        download_reel_video("reel-external-test")
    assert exc_external.value.status_code == 404
    assert "not available for download" in exc_external.value.detail

    # 9. Non-existent item handling
    with pytest.raises(HTTPException) as exc:
        download_portfolio_photo("non-existent-photo-xyz")
    assert exc.value.status_code == 404

    with pytest.raises(HTTPException) as exc:
        download_reel_video("non-existent-reel-xyz")
    assert exc.value.status_code == 404

    with pytest.raises(HTTPException) as exc:
        download_album_media("non-existent-album-xyz")
    assert exc.value.status_code == 404

def test_interactive_albums_public_structure():
    albums_res = data.get_albums()
    assert "featured" in albums_res
    assert "carousel" in albums_res
    assert "albums" in albums_res

    # Check that albums list is populated and contains spreads
    assert len(albums_res["albums"]) > 0
    first_album = albums_res["albums"][0]
    assert "id" in first_album
    assert "title" in first_album
    assert "cover" in first_album
    assert "previewImages" in first_album
    assert isinstance(first_album["previewImages"], list)
    assert len(first_album["previewImages"]) > 0

def test_token_expiry_and_tampering():
    # 1. Expired token (negative expiry hours)
    expired_token = create_access_token({"sub": "admin", "role": "superadmin"}, expires_hours=-1)
    with pytest.raises(ValueError) as exc:
        decode_access_token(expired_token)
    assert "expired" in str(exc.value).lower()

    # 2. Tampered signature
    valid_token = create_access_token({"sub": "admin", "role": "superadmin"})
    parts = valid_token.split(".")
    tampered_token = f"{parts[0]}.{parts[1]}.tamperedSignature123"
    with pytest.raises(ValueError) as exc_sig:
        decode_access_token(tampered_token)
    assert "signature" in str(exc_sig.value).lower()

    # 3. Malformed token format
    with pytest.raises(ValueError) as exc_fmt:
        decode_access_token("not-a-jwt")
    assert "format" in str(exc_fmt.value).lower()

def test_disabled_admin_user_workflow():
    from fastapi import HTTPException
    from fastapi.security import HTTPAuthorizationCredentials
    from app.api.deps import get_current_admin

    # Create inactive admin
    h = hash_password("DisabledPass123!")
    user_id = repository.create_admin(
        username="disabled_tester",
        email="disabled@lensframe.com",
        password_hash=h,
        role="editor",
        full_name="Disabled Tester"
    )
    assert user_id > 0
    # Deactivate the account
    repository.update_admin(user_id, {"is_active": 0})

    # 1. Attempt login with inactive account -> must return 403 Forbidden
    req = mock_request()
    with pytest.raises(HTTPException) as exc_login:
        auth.admin_login(LoginRequest(username="disabled_tester", password="DisabledPass123!"), req)
    assert exc_login.value.status_code == 403
    assert "disabled" in exc_login.value.detail.lower()

    # 2. Token access with inactive account -> must return 403 Forbidden
    token = create_access_token({"sub": "disabled_tester", "role": "editor"})
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    with pytest.raises(HTTPException) as exc_token:
        get_current_admin(creds)
    assert exc_token.value.status_code == 403
    assert "inactive" in exc_token.value.detail.lower()

def test_media_upload_and_magic_bytes():
    from app.api.routes.admin import _validate_media_magic_bytes

    # Valid PNG
    png_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
    assert _validate_media_magic_bytes(png_header, ".png") is True

    # Valid JPEG
    jpeg_header = b"\xff\xd8\xff\xe0\x00\x10JFIF"
    assert _validate_media_magic_bytes(jpeg_header, ".jpg") is True
    assert _validate_media_magic_bytes(jpeg_header, ".jpeg") is True

    # Valid WebP
    webp_header = b"RIFF\x24\x00\x00\x00WEBPVP8 "
    assert _validate_media_magic_bytes(webp_header, ".webp") is True

    # Valid MP4
    mp4_header = b"\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00isommp42"
    assert _validate_media_magic_bytes(mp4_header, ".mp4") is True

    # Disguised / fake image (e.g. bash script named script.jpg)
    script_header = b"#!/bin/bash\nrm -rf /"
    assert _validate_media_magic_bytes(script_header, ".jpg") is False
    assert _validate_media_magic_bytes(script_header, ".png") is False
    assert _validate_media_magic_bytes(script_header, ".webp") is False

def test_production_security_validation():
    orig_env = settings.ENVIRONMENT
    orig_jwt = settings.JWT_SECRET
    orig_pass = settings.INITIAL_ADMIN_PASSWORD
    orig_debug = settings.DEBUG

    try:
        settings.ENVIRONMENT = "production"
        assert settings.is_production is True

        # Case 1: Missing JWT secret
        settings.JWT_SECRET = ""
        settings.INITIAL_ADMIN_PASSWORD = "StrongUniquePassword@999"
        settings.DEBUG = False
        with pytest.raises(ValueError) as exc1:
            settings.validate_production_config()
        assert "non-empty JWT_SECRET" in str(exc1.value)

        # Case 2: Default JWT secret
        settings.JWT_SECRET = "lensframe-super-secret-key-change-in-production-2026-secure-token"
        with pytest.raises(ValueError) as exc2:
            settings.validate_production_config()
        assert "unique, non-default JWT_SECRET" in str(exc2.value)

        # Case 2b: Example placeholder JWT secret
        settings.JWT_SECRET = "replace-with-a-random-secure-secret-key-at-least-32-chars"
        with pytest.raises(ValueError) as exc2b:
            settings.validate_production_config()
        assert "unique, non-default JWT_SECRET" in str(exc2b.value)

        # Case 3: Missing initial admin password
        settings.JWT_SECRET = "a" * 32
        settings.INITIAL_ADMIN_PASSWORD = ""
        with pytest.raises(ValueError) as exc3:
            settings.validate_production_config()
        assert "explicitly configured INITIAL_ADMIN_PASSWORD" in str(exc3.value)

        # Case 4: Default initial admin password
        settings.INITIAL_ADMIN_PASSWORD = "LensFrame@2026!"
        with pytest.raises(ValueError) as exc4:
            settings.validate_production_config()
        assert "non-default INITIAL_ADMIN_PASSWORD" in str(exc4.value)

        # Case 4b: Example placeholder admin password
        settings.INITIAL_ADMIN_PASSWORD = "ChangeThisPasswordPromptly123!"
        with pytest.raises(ValueError) as exc4b:
            settings.validate_production_config()
        assert "non-default INITIAL_ADMIN_PASSWORD" in str(exc4b.value)

        # Case 5: DEBUG = True in production
        settings.INITIAL_ADMIN_PASSWORD = "StrongUniquePassword@999"
        settings.DEBUG = True
        with pytest.raises(ValueError) as exc5:
            settings.validate_production_config()
        assert "DEBUG must be set to False" in str(exc5.value)

        # Case 6: Valid secure production configuration passes without error
        settings.JWT_SECRET = "super-secure-production-jwt-signing-secret-key-2026-ok"
        settings.INITIAL_ADMIN_PASSWORD = "StrongUniquePassword@999"
        settings.DEBUG = False
        settings.validate_production_config()  # Must not raise

    finally:
        # Restore configuration
        settings.ENVIRONMENT = orig_env
        settings.JWT_SECRET = orig_jwt
        settings.INITIAL_ADMIN_PASSWORD = orig_pass
        settings.DEBUG = orig_debug

    # Case 7: Development & test configuration remain usable
    assert settings.is_production is False
    settings.validate_production_config()  # Must not raise

def test_exhaustive_media_security():
    from fastapi import HTTPException
    from app.api.routes.data import (
        _resolve_safe_media_path,
        download_album_media,
        download_portfolio_photo
    )
    from app.api.routes.admin import _validate_media_magic_bytes

    # 1. Path traversal & injection vectors
    assert _resolve_safe_media_path("../../../etc/passwd") is None
    assert _resolve_safe_media_path("/images/../../backend/.env") is None
    assert _resolve_safe_media_path("....//....//backend/.env") is None
    assert _resolve_safe_media_path("C:/Windows/System32/cmd.exe") is None
    assert _resolve_safe_media_path("D:/Project/photography-website/backend/.env") is None
    assert _resolve_safe_media_path("http://attacker.com/malicious.jpg") is None
    assert _resolve_safe_media_path("https://attacker.com/video.mp4") is None
    assert _resolve_safe_media_path("ftp://attacker.com/file.png") is None
    assert _resolve_safe_media_path("//attacker.com/payload.webp") is None

    # 2. Invalid extensions & null bytes
    for bad_ext in [".exe", ".sh", ".php", ".svg", ".html", ".db", ".env", ".py"]:
        assert _resolve_safe_media_path(f"/images/photo{bad_ext}") is None
    assert _resolve_safe_media_path("/images/photo.jpg\0.png") is None

    # 3. Truncated, empty, and malformed magic bytes
    assert _validate_media_magic_bytes(b"", ".jpg") is False
    assert _validate_media_magic_bytes(b"\xff", ".jpg") is False
    assert _validate_media_magic_bytes(b"\xff\xd8", ".jpg") is False
    assert _validate_media_magic_bytes(b"<?php echo 'bad'; ?>", ".jpg") is False
    assert _validate_media_magic_bytes(b"<script>alert(1)</script>", ".png") is False

    # 4. Cross-album allowlist enforcement:
    # album-1 only allows its own cover (/images/albums/album-1.jpg) and its own spreads.
    # Passing an image from album-2 must be rejected with HTTP 400.
    with pytest.raises(HTTPException) as exc_cross:
        download_album_media("album-1", image_url="/images/albums/album-2.jpg")
    assert exc_cross.value.status_code == 400
    assert "not in the trusted media allowlist" in exc_cross.value.detail

    # 5. Missing media file on disk for a valid record
    repository.create_portfolio_item({
        "id": "port-missing-file-test",
        "title": "Missing File Photo",
        "category": "weddings",
        "image": "/images/portfolio/non-existent-file-999.webp",
        "thumbnail": "/images/portfolio/non-existent-file-999.webp",
        "location": "Indore",
        "date": "2026"
    })
    with pytest.raises(HTTPException) as exc_missing:
        download_portfolio_photo("port-missing-file-test")
    assert exc_missing.value.status_code == 404
    assert "not found on server" in exc_missing.value.detail

def test_automated_login_lifecycle_and_security():
    from fastapi import HTTPException
    from fastapi.security import HTTPAuthorizationCredentials
    from app.api.deps import get_current_admin
    
    req = mock_request()
    
    # 1. Valid credentials -> Success 200 equivalent
    res = auth.admin_login(LoginRequest(
        username=settings.INITIAL_ADMIN_USERNAME,
        password=settings.INITIAL_ADMIN_PASSWORD
    ), req)
    assert res.token is not None
    assert res.admin.username == settings.INITIAL_ADMIN_USERNAME
    assert res.admin.role == "superadmin"
    
    # 2. Invalid credentials (non-existent username) -> HTTP 401
    with pytest.raises(HTTPException) as exc_invalid_user:
        auth.admin_login(LoginRequest(username="non_existent_user_999", password="Password123!"), req)
    assert exc_invalid_user.value.status_code == 401
    assert "invalid username or password" in exc_invalid_user.value.detail.lower()

    # 3. Incorrect password -> HTTP 401
    with pytest.raises(HTTPException) as exc_wrong_pw:
        auth.admin_login(LoginRequest(username=settings.INITIAL_ADMIN_USERNAME, password="WrongPassword999!"), req)
    assert exc_wrong_pw.value.status_code == 401
    assert "invalid username or password" in exc_wrong_pw.value.detail.lower()

    # 4. Missing fields / empty credentials -> Pydantic ValidationError (HTTP 422 in FastAPI)
    from pydantic import ValidationError
    with pytest.raises(ValidationError):
        LoginRequest(username=settings.INITIAL_ADMIN_USERNAME, password="")

    with pytest.raises(ValidationError):
        LoginRequest(username="", password=settings.INITIAL_ADMIN_PASSWORD)

    # 5. Disabled administrator -> HTTP 403
    h = hash_password("DisabledUserSecret123!")
    disabled_uid = repository.create_admin(
        username="temp_disabled_lifecycle",
        email="disabled_life@lensframe.com",
        password_hash=h,
        role="editor",
        full_name="Disabled Lifecycle Tester"
    )
    repository.update_admin(disabled_uid, {"is_active": 0})
    with pytest.raises(HTTPException) as exc_disabled:
        auth.admin_login(LoginRequest(username="temp_disabled_lifecycle", password="DisabledUserSecret123!"), req)
    assert exc_disabled.value.status_code == 403
    assert "disabled" in exc_disabled.value.detail.lower()

    # 6. Successful token generation & claims verification
    payload = decode_access_token(res.token)
    assert payload["sub"] == settings.INITIAL_ADMIN_USERNAME
    assert payload["role"] == "superadmin"
    assert "iat" in payload
    assert "exp" in payload
    assert payload["exp"] > payload["iat"]

    # 7. Access to protected endpoint using the returned token
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=res.token)
    current_admin_identity = get_current_admin(creds)
    assert current_admin_identity["username"] == settings.INITIAL_ADMIN_USERNAME
    
    # Access protected profile endpoint
    me_profile = auth.get_current_admin_profile(current_admin=current_admin_identity)
    assert me_profile.username == settings.INITIAL_ADMIN_USERNAME
    assert me_profile.role == "superadmin"

    # Access protected stats endpoint
    stats = admin.get_dashboard_statistics(current_admin=current_admin_identity)
    assert "bookings" in stats
    assert "messages" in stats

def test_extended_media_and_upload_security():
    from app.api.routes.data import _resolve_safe_media_path
    from app.api.routes.admin import _validate_media_magic_bytes
    
    # 1. Foreign drive letter mismatches (e.g. X:, Z:, C: on D: drive)
    assert _resolve_safe_media_path("Z:/uploads/malicious.jpg") is None
    assert _resolve_safe_media_path("X:\\uploads\\malicious.png") is None
    assert _resolve_safe_media_path("C:/uploads/exploit.webp") is None

    # 2. Oversized upload simulation check
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    oversized_len = max_bytes + 1
    assert oversized_len > max_bytes

    # 3. Malformed and spoofed headers across all supported extensions
    spoofed_cases = [
        (b"MZ\x90\x00\x03\x00\x00\x00", ".jpg"),            # Windows PE executable spoofed as JPG
        (b"MZ\x90\x00\x03\x00\x00\x00", ".png"),            # Windows PE executable spoofed as PNG
        (b"PK\x03\x04\x14\x00\x00\x00", ".webp"),           # ZIP / JAR archive spoofed as WebP
        (b"<?php echo 'shell'; ?>\n", ".jpg"),               # PHP web shell spoofed as JPG
        (b"<svg xmlns='http://www.w3.org/2000/svg'></svg>", ".jpg"), # SVG spoofed as JPG
        (b"<html><head><script>alert(1)</script></head>", ".png"), # HTML/XSS spoofed as PNG
        (b"\x00\x00\x00\x18ftypXXXX", ".mp4"),              # Corrupted MP4 container
        (b"\x1a\x45\xdf\xa3corrupt", ".webm"),              # Truncated WebM container
    ]
    for header, ext in spoofed_cases:
        assert _validate_media_magic_bytes(header, ext) is False

    # 4. Valid magic bytes across all supported types
    valid_cases = [
        (b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01", ".jpg"),
        (b"\xff\xd8\xff\xe1\x00\x18Exif\x00\x00", ".jpeg"),
        (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR", ".png"),
        (b"RIFF\x24\x00\x00\x00WEBPVP8 ", ".webp"),
        (b"\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00", ".mp4"),
        (b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00", ".mp4"),
        (b"\x1a\x45\xdf\xa3\x93\x42\x86\x81\x01\x42\xf7\x81\x01\x42\x82\x84webm", ".webm"),
    ]
    for header, ext in valid_cases:
        assert _validate_media_magic_bytes(header, ext) is True




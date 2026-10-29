import csv
import io
import json
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.db.database import get_db_connection

def _row_to_dict(row) -> Optional[Dict[str, Any]]:
    if row is None:
        return None
    return dict(row)

def _rows_to_dicts(rows) -> List[Dict[str, Any]]:
    return [dict(r) for r in rows]

# ==================== ADMINS & ACTIVITY LOGS ====================

def get_admin_by_username(username: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM admins WHERE username = ?;", (username,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def get_admin_by_id(admin_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM admins WHERE id = ?;", (admin_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def get_admins() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT id, username, email, role, full_name, is_active, created_at, last_login FROM admins ORDER BY id ASC;").fetchall()
    conn.close()
    return _rows_to_dicts(rows)

def create_admin(username: str, email: str, password_hash: str, role: str = "editor", full_name: str = "") -> int:
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO admins (username, email, password_hash, role, full_name, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?);
    """, (username, email, password_hash, role, full_name, now))
    admin_id = cur.lastrowid
    conn.commit()
    conn.close()
    return admin_id

def update_admin(admin_id: int, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()

    # Safeguard: Ensure at least one active superadmin remains
    target = conn.execute("SELECT role, is_active FROM admins WHERE id = ?;", (admin_id,)).fetchone()
    if target and target["role"] == "superadmin":
        is_deactivating = updates.get("is_active") in (0, False)
        is_demoting = updates.get("role") and updates.get("role") != "superadmin"
        if is_deactivating or is_demoting:
            other_superadmins = conn.execute(
                "SELECT COUNT(*) FROM admins WHERE role = 'superadmin' AND is_active = 1 AND id != ?;",
                (admin_id,)
            ).fetchone()[0]
            if other_superadmins == 0:
                conn.close()
                raise ValueError("Cannot deactivate or demote the last active Superadmin account.")

    allowed_fields = ["email", "role", "full_name", "is_active"]
    set_clauses = []
    values = []
    for k, v in updates.items():
        if k in allowed_fields:
            set_clauses.append(f"{k} = ?")
            values.append(v)
    if not set_clauses:
        conn.close()
        return False
    values.append(admin_id)
    sql = f"UPDATE admins SET {', '.join(set_clauses)} WHERE id = ?;"
    conn.execute(sql, values)
    conn.commit()
    conn.close()
    return True

def update_admin_password(admin_id: int, password_hash: str) -> bool:
    conn = get_db_connection()
    conn.execute("UPDATE admins SET password_hash = ? WHERE id = ?;", (password_hash, admin_id))
    conn.commit()
    conn.close()
    return True

def update_admin_last_login(admin_id: int):
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    conn.execute("UPDATE admins SET last_login = ? WHERE id = ?;", (now, admin_id))
    conn.commit()
    conn.close()

def delete_admin(admin_id: int) -> bool:
    conn = get_db_connection()
    # Ensure at least one active superadmin remains
    superadmins = conn.execute("SELECT COUNT(*) FROM admins WHERE role = 'superadmin' AND is_active = 1 AND id != ?;", (admin_id,)).fetchone()[0]
    target = conn.execute("SELECT role FROM admins WHERE id = ?;", (admin_id,)).fetchone()
    if target and target["role"] == "superadmin" and superadmins == 0:
        conn.close()
        raise ValueError("Cannot delete the last active Superadmin account")
    conn.execute("DELETE FROM admins WHERE id = ?;", (admin_id,))
    conn.commit()
    conn.close()
    return True

def log_activity(admin_username: str, action: str, entity_type: str, entity_id: str = "", details: str = "", ip_address: str = ""):
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    conn.execute("""
    INSERT INTO activity_logs (admin_username, action, entity_type, entity_id, details, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, (admin_username, action, entity_type, entity_id, details, ip_address, now))
    conn.commit()
    conn.close()

def get_recent_activity_logs(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("""
    SELECT * FROM activity_logs ORDER BY id DESC LIMIT ?;
    """, (limit,)).fetchall()
    conn.close()
    return _rows_to_dicts(rows)

# ==================== BOOKINGS ====================

def create_booking(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    booking_id = f"BK-{uuid.uuid4().hex[:6].upper()}"
    conn.execute("""
    INSERT INTO bookings (booking_id, full_name, phone, package_tier, event_date, message, status, internal_notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', '', ?, ?);
    """, (
        booking_id,
        data.get("full_name", "").strip(),
        data.get("phone", "").strip(),
        data.get("package_tier", "").strip(),
        data.get("event_date", "").strip(),
        data.get("message", "").strip() if data.get("message") else "",
        now,
        now
    ))
    conn.commit()
    conn.close()
    return booking_id

def get_bookings(
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 20
) -> Tuple[List[Dict[str, Any]], int]:
    conn = get_db_connection()
    conditions = []
    params: List[Any] = []

    if status and isinstance(status, str) and status.lower() != "all":
        conditions.append("status = ?")
        params.append(status.lower())

    if search and isinstance(search, str):
        search_pattern = f"%{search.strip()}%"
        conditions.append("(full_name LIKE ? OR phone LIKE ? OR booking_id LIKE ? OR package_tier LIKE ?)")
        params.extend([search_pattern, search_pattern, search_pattern, search_pattern])

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    
    # Count total
    count_sql = f"SELECT COUNT(*) FROM bookings {where_clause};"
    total = conn.execute(count_sql, params).fetchone()[0]

    # Paginate
    p = page if isinstance(page, int) and page >= 1 else 1
    ps = page_size if isinstance(page_size, int) and page_size >= 1 else 20
    offset = (p - 1) * ps
    query_sql = f"""
    SELECT * FROM bookings {where_clause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?;
    """
    rows = conn.execute(query_sql, params + [ps, offset]).fetchall()
    conn.close()
    return _rows_to_dicts(rows), total

def get_booking_by_id(booking_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM bookings WHERE booking_id = ?;", (booking_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def update_booking(booking_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["status", "internal_notes", "event_date", "package_tier", "phone", "full_name"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            params.append(v)
    if not clauses:
        conn.close()
        return False
    now = datetime.now(timezone.utc).isoformat()
    clauses.append("updated_at = ?")
    params.append(now)
    params.append(booking_id)

    sql = f"UPDATE bookings SET {', '.join(clauses)} WHERE booking_id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_booking(booking_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM bookings WHERE booking_id = ?;", (booking_id,))
    conn.commit()
    conn.close()
    return True

def export_bookings_csv() -> str:
    conn = get_db_connection()
    rows = conn.execute("SELECT booking_id, full_name, phone, package_tier, event_date, status, internal_notes, created_at FROM bookings ORDER BY created_at DESC;").fetchall()
    conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Booking ID", "Customer Name", "Phone", "Package", "Event Date", "Status", "Notes", "Created At"])
    for r in rows:
        writer.writerow([r["booking_id"], r["full_name"], r["phone"], r["package_tier"], r["event_date"], r["status"], r["internal_notes"], r["created_at"]])
    return output.getvalue()

# ==================== CONTACTS ====================

def create_contact(data: Dict[str, Any]) -> int:
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO contacts (name, email, message, status, is_read, internal_notes, created_at)
    VALUES (?, ?, ?, 'new', 0, '', ?);
    """, (
        data.get("name", "").strip(),
        data.get("email", "").strip(),
        data.get("message", "").strip(),
        now
    ))
    cid = cur.lastrowid
    conn.commit()
    conn.close()
    return cid

def get_contacts(
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 20
) -> Tuple[List[Dict[str, Any]], int]:
    conn = get_db_connection()
    conditions = []
    params: List[Any] = []

    if status and isinstance(status, str) and status.lower() != "all":
        conditions.append("status = ?")
        params.append(status.lower())

    if search and isinstance(search, str):
        p = f"%{search.strip()}%"
        conditions.append("(name LIKE ? OR email LIKE ? OR message LIKE ?)")
        params.extend([p, p, p])

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    total = conn.execute(f"SELECT COUNT(*) FROM contacts {where};", params).fetchone()[0]

    p = page if isinstance(page, int) and page >= 1 else 1
    ps = page_size if isinstance(page_size, int) and page_size >= 1 else 20
    offset = (p - 1) * ps
    rows = conn.execute(f"SELECT * FROM contacts {where} ORDER BY created_at DESC LIMIT ? OFFSET ?;", params + [ps, offset]).fetchall()
    conn.close()
    return _rows_to_dicts(rows), total

def get_contact_by_id(contact_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM contacts WHERE id = ?;", (contact_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def update_contact(contact_id: int, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["status", "is_read", "internal_notes"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            params.append(v)
    if not clauses:
        conn.close()
        return False
    params.append(contact_id)
    sql = f"UPDATE contacts SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_contact(contact_id: int) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM contacts WHERE id = ?;", (contact_id,))
    conn.commit()
    conn.close()
    return True

# ==================== PORTFOLIO ====================

def get_portfolio(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: Optional[int] = None,
    page_size: Optional[int] = None
) -> Tuple[List[Dict[str, Any]], int]:
    conn = get_db_connection()
    conditions = []
    params: List[Any] = []

    if category and isinstance(category, str) and category.lower() != "all":
        conditions.append("LOWER(category) = LOWER(?)")
        params.append(category)

    if search and isinstance(search, str):
        p = f"%{search.strip()}%"
        conditions.append("(title LIKE ? OR location LIKE ? OR tags LIKE ?)")
        params.extend([p, p, p])

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    total = conn.execute(f"SELECT COUNT(*) FROM portfolio {where};", params).fetchone()[0]

    if isinstance(page, int) and isinstance(page_size, int) and page >= 1 and page_size >= 1:
        offset = (page - 1) * page_size
        sql = f"SELECT * FROM portfolio {where} ORDER BY order_index ASC, created_at DESC LIMIT ? OFFSET ?;"
        rows = conn.execute(sql, params + [page_size, offset]).fetchall()
    else:
        sql = f"SELECT * FROM portfolio {where} ORDER BY order_index ASC, created_at DESC;"
        rows = conn.execute(sql, params).fetchall()

    conn.close()
    return _rows_to_dicts(rows), total

def get_portfolio_item(item_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM portfolio WHERE id = ?;", (item_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def create_portfolio_item(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    item_id = data.get("id") or f"port-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    max_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM portfolio;").fetchone()[0]
    
    img = (data.get("image") or "").strip()
    thumb = (data.get("thumbnail") or img).strip()

    conn.execute("""
    INSERT INTO portfolio (id, title, category, image, thumbnail, location, date, aspect, tags, alt_text, is_featured, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        item_id,
        (data.get("title") or "Untitled").strip(),
        (data.get("category") or "weddings").strip().lower(),
        img,
        thumb,
        (data.get("location") or "Indore").strip(),
        (data.get("date") or "2025").strip(),
        data.get("aspect") or "vertical",
        (data.get("tags") or "").strip(),
        (data.get("alt_text") or data.get("title") or "").strip(),
        1 if data.get("is_featured") else 0,
        data.get("order_index") if isinstance(data.get("order_index"), int) else max_order,
        now
    ))
    conn.commit()
    conn.close()
    return item_id

def update_portfolio_item(item_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["title", "category", "image", "thumbnail", "location", "date", "aspect", "tags", "alt_text", "is_featured", "order_index"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            params.append(v)
    if not clauses:
        conn.close()
        return False
    params.append(item_id)
    sql = f"UPDATE portfolio SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_portfolio_item(item_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM portfolio WHERE id = ?;", (item_id,))
    conn.commit()
    conn.close()
    return True

def reorder_portfolio(ordered_ids: List[str]) -> bool:
    conn = get_db_connection()
    for index, pid in enumerate(ordered_ids):
        conn.execute("UPDATE portfolio SET order_index = ? WHERE id = ?;", (index, pid))
    conn.commit()
    conn.close()
    return True

# ==================== ALBUMS ====================

def get_albums_admin() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM albums ORDER BY is_featured DESC, order_index ASC;").fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        try:
            d["preview_images"] = json.loads(d.get("preview_images") or "[]")
        except Exception:
            d["preview_images"] = []
        results.append(d)
    return results

def get_albums_public() -> Dict[str, Any]:
    conn = get_db_connection()
    feat_row = conn.execute("SELECT * FROM albums WHERE is_featured = 1 AND is_visible = 1 LIMIT 1;").fetchone()
    if not feat_row:
        feat_row = conn.execute("SELECT * FROM albums WHERE is_visible = 1 ORDER BY order_index ASC LIMIT 1;").fetchone()

    all_rows = conn.execute("""
    SELECT id, title, subtitle, photos_count AS photosCount, badge_or_tag AS badge, badge_or_tag AS tag, cover, preview_images, is_featured
    FROM albums
    WHERE is_visible = 1
    ORDER BY order_index ASC;
    """).fetchall()
    conn.close()

    all_albums = []
    for r in all_rows:
        d = dict(r)
        try:
            previews = json.loads(d.get("preview_images") or "[]")
            if not isinstance(previews, list) or len(previews) == 0:
                previews = [d["cover"]]
        except Exception:
            previews = [d["cover"]]
        item = {
            "id": d["id"],
            "title": d["title"],
            "subtitle": d.get("subtitle") or "Archival fine-art handcrafted album spread.",
            "photosCount": d.get("photosCount", 0),
            "badge": d.get("badge", "Archival Spread"),
            "tag": d.get("tag", "Archival Spread"),
            "cover": d["cover"],
            "previewImages": previews,
            "isFeatured": bool(d.get("is_featured", 0))
        }
        all_albums.append(item)

    featured_dict = {}
    if feat_row:
        f = dict(feat_row)
        try:
            previews = json.loads(f.get("preview_images") or "[]")
            if not isinstance(previews, list) or len(previews) == 0:
                previews = [f["cover"]]
        except Exception:
            previews = [f["cover"]]
        featured_dict = {
            "id": f["id"],
            "title": f["title"],
            "subtitle": f.get("subtitle", ""),
            "photosCount": f.get("photos_count", 0),
            "badge": f.get("badge_or_tag", "Featured"),
            "tag": f.get("badge_or_tag", "Featured"),
            "cover": f["cover"],
            "previewImages": previews,
            "isFeatured": bool(f.get("is_featured", 0))
        }
    elif all_albums:
        featured_dict = all_albums[0]

    carousel = [a for a in all_albums if a["id"] != featured_dict.get("id")]

    return {
        "featured": featured_dict,
        "carousel": carousel,
        "albums": all_albums
    }

def get_album_by_id(album_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM albums WHERE id = ?;", (album_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    try:
        d["preview_images"] = json.loads(d.get("preview_images") or "[]")
    except Exception:
        d["preview_images"] = []
    return d

def create_album(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    album_id = data.get("id") or f"album-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    previews = json.dumps(data.get("preview_images", []))
    max_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM albums;").fetchone()[0]

    # If new album is featured, unfeature others
    if data.get("is_featured"):
        conn.execute("UPDATE albums SET is_featured = 0;")

    conn.execute("""
    INSERT INTO albums (id, title, subtitle, photos_count, badge_or_tag, cover, preview_images, is_featured, is_visible, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        album_id,
        data.get("title", "Untitled Album").strip(),
        data.get("subtitle", "").strip(),
        int(data.get("photos_count", 0)),
        data.get("badge_or_tag", "Album Spread").strip(),
        data.get("cover", "").strip(),
        previews,
        1 if data.get("is_featured") else 0,
        1 if data.get("is_visible", True) else 0,
        data.get("order_index", max_order),
        now
    ))
    conn.commit()
    conn.close()
    return album_id

def update_album(album_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    if updates.get("is_featured") in (1, True):
        conn.execute("UPDATE albums SET is_featured = 0 WHERE id != ?;", (album_id,))

    allowed = ["title", "subtitle", "photos_count", "badge_or_tag", "cover", "preview_images", "is_featured", "is_visible", "order_index"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            if k == "preview_images" and isinstance(v, list):
                params.append(json.dumps(v))
            elif k in ("is_featured", "is_visible"):
                params.append(1 if v else 0)
            else:
                params.append(v)
    if not clauses:
        conn.close()
        return False
    params.append(album_id)
    sql = f"UPDATE albums SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_album(album_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM albums WHERE id = ?;", (album_id,))
    conn.commit()
    conn.close()
    return True

# ==================== REELS ====================

def get_reels(only_visible: bool = False) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if only_visible:
        rows = conn.execute("SELECT * FROM reels WHERE is_visible = 1 ORDER BY order_index ASC;").fetchall()
    else:
        rows = conn.execute("SELECT * FROM reels ORDER BY order_index ASC;").fetchall()
    conn.close()
    return _rows_to_dicts(rows)

def get_reel_by_id(reel_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM reels WHERE id = ?;", (reel_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def create_reel(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    reel_id = data.get("id") or f"reel-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    max_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM reels;").fetchone()[0]

    conn.execute("""
    INSERT INTO reels (id, shortcode, url, embed_url, video_url, cover, title, category, duration, is_visible, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        reel_id,
        data.get("shortcode", "").strip(),
        data.get("url", "").strip(),
        data.get("embed_url", "").strip(),
        data.get("video_url", "").strip(),
        data.get("cover", "").strip(),
        data.get("title", "Highlight Reel").strip(),
        data.get("category", "Weddings").strip(),
        data.get("duration", "0:45").strip(),
        1 if data.get("is_visible", True) else 0,
        data.get("order_index", max_order),
        now
    ))
    conn.commit()
    conn.close()
    return reel_id

def update_reel(reel_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["shortcode", "url", "embed_url", "video_url", "cover", "title", "category", "duration", "is_visible", "order_index"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            params.append(1 if v else 0 if k == "is_visible" else v)
    if not clauses:
        conn.close()
        return False
    params.append(reel_id)
    sql = f"UPDATE reels SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_reel(reel_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM reels WHERE id = ?;", (reel_id,))
    conn.commit()
    conn.close()
    return True

# ==================== PACKAGES ====================

def get_packages(only_active: bool = False) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if only_active:
        rows = conn.execute("SELECT * FROM packages WHERE is_active = 1 ORDER BY order_index ASC;").fetchall()
    else:
        rows = conn.execute("SELECT * FROM packages ORDER BY order_index ASC;").fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["popular"] = bool(d.get("popular"))
        d["is_active"] = bool(d.get("is_active"))
        d["priceNum"] = d.get("price_num", 0)
        try:
            d["features"] = json.loads(d.get("features") or "[]")
        except Exception:
            d["features"] = []
        results.append(d)
    return results

def get_package_by_id(pkg_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM packages WHERE id = ?;", (pkg_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["popular"] = bool(d.get("popular"))
    d["is_active"] = bool(d.get("is_active"))
    d["priceNum"] = d.get("price_num", 0)
    try:
        d["features"] = json.loads(d.get("features") or "[]")
    except Exception:
        d["features"] = []
    return d

def create_package(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    pkg_id = data.get("id") or f"pkg-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    max_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM packages;").fetchone()[0]
    features_json = json.dumps(data.get("features", []))

    conn.execute("""
    INSERT INTO packages (id, name, tagline, price, price_num, popular, features, is_active, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        pkg_id,
        data.get("name", "Package").strip(),
        data.get("tagline", "").strip(),
        data.get("price", "₹0").strip(),
        int(data.get("price_num", data.get("priceNum", 0))),
        1 if data.get("popular") else 0,
        features_json,
        1 if data.get("is_active", True) else 0,
        data.get("order_index", max_order),
        now
    ))
    conn.commit()
    conn.close()
    return pkg_id

def update_package(pkg_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["name", "tagline", "price", "price_num", "priceNum", "popular", "features", "is_active", "order_index"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            db_col = "price_num" if k == "priceNum" else k
            clauses.append(f"{db_col} = ?")
            if k == "features" and isinstance(v, list):
                params.append(json.dumps(v))
            elif k in ("popular", "is_active"):
                params.append(1 if v else 0)
            else:
                params.append(v)
    if not clauses:
        conn.close()
        return False
    params.append(pkg_id)
    sql = f"UPDATE packages SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_package(pkg_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM packages WHERE id = ?;", (pkg_id,))
    conn.commit()
    conn.close()
    return True

# ==================== TESTIMONIALS ====================

def get_testimonials(only_approved: bool = False) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if only_approved:
        rows = conn.execute("SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY order_index ASC;").fetchall()
    else:
        rows = conn.execute("SELECT * FROM testimonials ORDER BY order_index ASC;").fetchall()
    conn.close()
    return _rows_to_dicts(rows)

def get_testimonial_by_id(test_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM testimonials WHERE id = ?;", (test_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)

def create_testimonial(data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    test_id = data.get("id") or f"test-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()
    max_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM testimonials;").fetchone()[0]

    conn.execute("""
    INSERT INTO testimonials (id, name, event, rating, quote, avatar, is_approved, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        test_id,
        data.get("name", "Client").strip(),
        data.get("event", "Wedding").strip(),
        int(data.get("rating", 5)),
        data.get("quote", "").strip(),
        data.get("avatar", "").strip(),
        1 if data.get("is_approved", True) else 0,
        data.get("order_index", max_order),
        now
    ))
    conn.commit()
    conn.close()
    return test_id

def update_testimonial(test_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    allowed = ["name", "event", "rating", "quote", "avatar", "is_approved", "order_index"]
    clauses = []
    params = []
    for k, v in updates.items():
        if k in allowed:
            clauses.append(f"{k} = ?")
            params.append(1 if v else 0 if k == "is_approved" else v)
    if not clauses:
        conn.close()
        return False
    params.append(test_id)
    sql = f"UPDATE testimonials SET {', '.join(clauses)} WHERE id = ?;"
    conn.execute(sql, params)
    conn.commit()
    conn.close()
    return True

def delete_testimonial(test_id: str) -> bool:
    conn = get_db_connection()
    conn.execute("DELETE FROM testimonials WHERE id = ?;", (test_id,))
    conn.commit()
    conn.close()
    return True

# ==================== SETTINGS ====================

def get_settings(category: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    if category:
        rows = conn.execute("SELECT key, value, category FROM settings WHERE category = ?;", (category,)).fetchall()
    else:
        rows = conn.execute("SELECT key, value, category FROM settings;").fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}

def get_public_settings() -> Dict[str, Any]:
    """Return only safe public settings (exclude email credentials, security params)."""
    conn = get_db_connection()
    rows = conn.execute("""
    SELECT key, value, category FROM settings
    WHERE category IN ('general', 'social', 'gallery', 'seo');
    """).fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}

def update_settings(updates: Dict[str, str], category: str) -> bool:
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    for k, v in updates.items():
        conn.execute("""
        INSERT INTO settings (key, value, category, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;
        """, (k, str(v), category, now))
    conn.commit()
    conn.close()
    return True

# ==================== DASHBOARD STATS ====================

def get_dashboard_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()

    total_bookings = cur.execute("SELECT COUNT(*) FROM bookings;").fetchone()[0]
    pending_bookings = cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'pending';").fetchone()[0]
    confirmed_bookings = cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed';").fetchone()[0]
    completed_bookings = cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'completed';").fetchone()[0]
    cancelled_bookings = cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'cancelled';").fetchone()[0]

    total_contacts = cur.execute("SELECT COUNT(*) FROM contacts;").fetchone()[0]
    unread_contacts = cur.execute("SELECT COUNT(*) FROM contacts WHERE is_read = 0;").fetchone()[0]

    total_portfolio = cur.execute("SELECT COUNT(*) FROM portfolio;").fetchone()[0]
    total_albums = cur.execute("SELECT COUNT(*) FROM albums;").fetchone()[0]
    total_reels = cur.execute("SELECT COUNT(*) FROM reels;").fetchone()[0]
    total_packages = cur.execute("SELECT COUNT(*) FROM packages;").fetchone()[0]
    total_testimonials = cur.execute("SELECT COUNT(*) FROM testimonials;").fetchone()[0]

    recent_bookings = _rows_to_dicts(cur.execute("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;").fetchall())
    recent_contacts = _rows_to_dicts(cur.execute("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5;").fetchall())
    recent_activity = _rows_to_dicts(cur.execute("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 10;").fetchall())

    # Monthly analytics (last 6 months)
    monthly_rows = cur.execute("""
    SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count
    FROM bookings
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month DESC
    LIMIT 6;
    """).fetchall()

    monthly_stats = [{"month": r["month"], "count": r["count"]} for r in reversed(monthly_rows)]

    # Estimated revenue from confirmed & completed bookings (if valid package price matches)
    revenue_row = cur.execute("""
    SELECT SUM(p.price_num)
    FROM bookings b
    JOIN packages p ON LOWER(b.package_tier) = LOWER(p.id) OR LOWER(b.package_tier) = LOWER(p.name)
    WHERE b.status IN ('confirmed', 'completed');
    """).fetchone()
    estimated_revenue = revenue_row[0] or 0

    conn.close()

    return {
        "bookings": {
            "total": total_bookings,
            "pending": pending_bookings,
            "confirmed": confirmed_bookings,
            "completed": completed_bookings,
            "cancelled": cancelled_bookings,
            "estimated_revenue": estimated_revenue,
        },
        "messages": {
            "total": total_contacts,
            "unread": unread_contacts,
        },
        "content": {
            "portfolio": total_portfolio,
            "albums": total_albums,
            "reels": total_reels,
            "packages": total_packages,
            "testimonials": total_testimonials,
        },
        "recent_bookings": recent_bookings,
        "recent_contacts": recent_contacts,
        "recent_activity": recent_activity,
        "monthly_bookings": monthly_stats,
    }

import json
import os
import sqlite3
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.core.security import hash_password

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def get_db_connection() -> sqlite3.Connection:
    """Create and configure a SQLite connection."""
    os.makedirs(os.path.dirname(settings.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH, timeout=20.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def _read_seed_json(filename: str) -> Any:
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading seed file {filename}: {e}")
        return None

def init_db():
    """Initialize database tables, indexes, and seed initial records if empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Admins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'superadmin',
        full_name TEXT NOT NULL DEFAULT '',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        last_login TEXT
    );
    """)

    # 2. Bookings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        package_tier TEXT NOT NULL,
        event_date TEXT NOT NULL,
        message TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        internal_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);")

    # 3. Contacts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        is_read INTEGER NOT NULL DEFAULT 0,
        internal_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);")

    # 4. Portfolio Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS portfolio (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        aspect TEXT NOT NULL DEFAULT 'vertical',
        tags TEXT DEFAULT '',
        alt_text TEXT DEFAULT '',
        is_featured INTEGER NOT NULL DEFAULT 0,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio(order_index);")

    # 5. Albums Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS albums (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT DEFAULT '',
        photos_count INTEGER NOT NULL DEFAULT 0,
        badge_or_tag TEXT DEFAULT '',
        cover TEXT NOT NULL,
        preview_images TEXT DEFAULT '[]',
        is_featured INTEGER NOT NULL DEFAULT 0,
        is_visible INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_albums_visible ON albums(is_visible);")

    # 6. Reels Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reels (
        id TEXT PRIMARY KEY,
        shortcode TEXT DEFAULT '',
        url TEXT DEFAULT '',
        embed_url TEXT DEFAULT '',
        video_url TEXT DEFAULT '',
        cover TEXT DEFAULT '',
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        duration TEXT DEFAULT '',
        is_visible INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_reels_visible ON reels(is_visible);")

    # Column safety migration for existing DB
    try:
        cursor.execute("ALTER TABLE reels ADD COLUMN cover TEXT DEFAULT '';")
    except sqlite3.OperationalError:
        pass

    # 7. Packages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        price TEXT NOT NULL,
        price_num INTEGER NOT NULL,
        popular INTEGER NOT NULL DEFAULT 0,
        features TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);")

    # 8. Testimonials Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        event TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        quote TEXT NOT NULL,
        avatar TEXT NOT NULL,
        is_approved INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);")

    # 9. Settings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        category TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 10. Activity Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_username TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT DEFAULT '',
        details TEXT DEFAULT '',
        ip_address TEXT DEFAULT '',
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at);")

    conn.commit()

    # --- SEEDING (Idempotent) ---
    now = datetime.now(timezone.utc).isoformat()

    # Seed initial Admin if table is empty
    cursor.execute("SELECT COUNT(*) FROM admins;")
    if cursor.fetchone()[0] == 0:
        hashed = hash_password(settings.INITIAL_ADMIN_PASSWORD)
        cursor.execute("""
        INSERT INTO admins (username, email, password_hash, role, full_name, is_active, created_at)
        VALUES (?, ?, ?, 'superadmin', 'Lead Administrator', 1, ?);
        """, (settings.INITIAL_ADMIN_USERNAME, settings.INITIAL_ADMIN_EMAIL, hashed, now))
        cursor.execute("""
        INSERT INTO activity_logs (admin_username, action, entity_type, entity_id, details, created_at)
        VALUES (?, 'INITIALIZE', 'system', 'admin', 'Initial superadmin account bootstrapped', ?);
        """, (settings.INITIAL_ADMIN_USERNAME, now))
        conn.commit()

    # Seed Portfolio
    cursor.execute("SELECT COUNT(*) FROM portfolio;")
    if cursor.fetchone()[0] == 0:
        portfolio_items = _read_seed_json("portfolio.json")
        if portfolio_items and isinstance(portfolio_items, list):
            for idx, item in enumerate(portfolio_items):
                cursor.execute("""
                INSERT OR IGNORE INTO portfolio (id, title, category, image, thumbnail, location, date, aspect, tags, alt_text, is_featured, order_index, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    item.get("id"),
                    item.get("title", "Untitled Moment"),
                    item.get("category", "weddings"),
                    item.get("image", ""),
                    item.get("thumbnail", item.get("image", "")),
                    item.get("location", "Indore"),
                    item.get("date", "2025"),
                    item.get("aspect", "vertical"),
                    item.get("tags", ""),
                    item.get("title", ""),
                    1 if idx < 3 else 0,
                    idx,
                    now
                ))
            conn.commit()

    # Seed Albums
    cursor.execute("SELECT COUNT(*) FROM albums;")
    if cursor.fetchone()[0] == 0:
        albums_data = _read_seed_json("albums.json")
        if albums_data and isinstance(albums_data, dict):
            # Featured
            feat = albums_data.get("featured")
            if feat:
                cursor.execute("""
                INSERT OR IGNORE INTO albums (id, title, subtitle, photos_count, badge_or_tag, cover, preview_images, is_featured, is_visible, order_index, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 0, ?);
                """, (
                    feat.get("id", "album-featured"),
                    feat.get("title", "Royal Mandap & Grand Vows"),
                    feat.get("subtitle", ""),
                    feat.get("photosCount", 50),
                    feat.get("badge", "Handcrafted Album Spread"),
                    feat.get("cover", ""),
                    json.dumps(feat.get("previewImages", [])),
                    now
                ))
            # Carousel
            carousel = albums_data.get("carousel", [])
            for idx, alb in enumerate(carousel):
                cursor.execute("""
                INSERT OR IGNORE INTO albums (id, title, subtitle, photos_count, badge_or_tag, cover, preview_images, is_featured, is_visible, order_index, created_at)
                VALUES (?, ?, '', ?, ?, ?, '[]', 0, 1, ?, ?);
                """, (
                    alb.get("id", f"album-{idx+1}"),
                    alb.get("title", ""),
                    alb.get("photosCount", 40),
                    alb.get("tag", "Spread"),
                    alb.get("cover", ""),
                    idx + 1,
                    now
                ))
            conn.commit()

    # Seed Reels
    cursor.execute("SELECT COUNT(*) FROM reels;")
    if cursor.fetchone()[0] == 0:
        reels_items = _read_seed_json("reels.json")
        if reels_items and isinstance(reels_items, list):
            for idx, r in enumerate(reels_items):
                cursor.execute("""
                INSERT OR IGNORE INTO reels (id, shortcode, url, embed_url, video_url, cover, title, category, duration, is_visible, order_index, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?);
                """, (
                    r.get("id", f"reel-{idx+1}"),
                    r.get("shortcode", ""),
                    r.get("url", ""),
                    r.get("embedUrl", ""),
                    r.get("videoUrl", ""),
                    r.get("cover", f"/videos/reels/reel-{idx+1}-poster.jpg"),
                    r.get("title", "Wedding Highlight"),
                    r.get("category", "Weddings"),
                    r.get("duration", "0:45"),
                    idx,
                    now
                ))
            conn.commit()

    # Seed Packages
    cursor.execute("SELECT COUNT(*) FROM packages;")
    if cursor.fetchone()[0] == 0:
        packages_items = _read_seed_json("packages.json")
        if packages_items and isinstance(packages_items, list):
            for idx, p in enumerate(packages_items):
                features_json = json.dumps(p.get("features", []))
                cursor.execute("""
                INSERT OR IGNORE INTO packages (id, name, tagline, price, price_num, popular, features, is_active, order_index, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?);
                """, (
                    p.get("id", f"pkg-{idx+1}"),
                    p.get("name", "Package"),
                    p.get("tagline", ""),
                    p.get("price", "₹0"),
                    p.get("priceNum", 0),
                    1 if p.get("popular") else 0,
                    features_json,
                    idx,
                    now
                ))
            conn.commit()

    # Seed Testimonials
    cursor.execute("SELECT COUNT(*) FROM testimonials;")
    if cursor.fetchone()[0] == 0:
        test_items = _read_seed_json("testimonials.json")
        if test_items and isinstance(test_items, list):
            for idx, t in enumerate(test_items):
                cursor.execute("""
                INSERT OR IGNORE INTO testimonials (id, name, event, rating, quote, avatar, is_approved, order_index, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?);
                """, (
                    t.get("id", f"test-{idx+1}"),
                    t.get("name", "Client"),
                    t.get("event", "Wedding"),
                    t.get("rating", 5),
                    t.get("quote", ""),
                    t.get("avatar", ""),
                    idx,
                    now
                ))
            conn.commit()

    # Seed Settings
    cursor.execute("SELECT COUNT(*) FROM settings;")
    if cursor.fetchone()[0] == 0:
        default_settings = [
            ("site_name", "LensFrame", "general"),
            ("photographer_name", "Arjun Sharma", "general"),
            ("tagline", "Capture · Create · Forever", "general"),
            ("phone", "+91 98765 43210", "general"),
            ("email", "arjun@lensframe.com", "general"),
            ("hours", "Mon - Sun, 9:00 AM - 8:00 PM", "general"),
            ("location", "Indore, Madhya Pradesh", "general"),
            ("availability", "Available Pan-India & Destinations Worldwide", "general"),
            ("bio", "Capturing eternal emotions, intimate silhouettes, and high-fashion editorial weddings across India and exotic destinations worldwide.", "general"),
            ("instagram", "https://instagram.com", "social"),
            ("youtube", "https://youtube.com", "social"),
            ("facebook", "https://facebook.com", "social"),
            ("twitter", "https://twitter.com", "social"),
            ("whatsapp", "+919876543210", "social"),
            ("default_category", "all", "gallery"),
            ("items_per_page", "12", "gallery"),
            ("enable_lightbox", "true", "gallery"),
            ("meta_title", "LensFrame — Arjun Sharma Photography", "seo"),
            ("meta_description", "Luxury destination wedding photography, fine-art bridal portraits, and cinematic wedding films by Arjun Sharma.", "seo"),
            ("meta_keywords", "wedding photographer, luxury wedding photography, indore wedding, rajasthan destination wedding", "seo"),
            ("og_image", "/images/portfolio/insta-2.webp", "seo"),
            ("notify_email", "arjun@lensframe.com", "email"),
            ("send_customer_confirmation", "true", "email"),
            ("send_admin_alert", "true", "email"),
        ]
        for key, value, category in default_settings:
            cursor.execute("""
            INSERT OR IGNORE INTO settings (key, value, category, updated_at)
            VALUES (?, ?, ?, ?);
            """, (key, value, category, now))
        conn.commit()

    conn.close()


# 📸 LensFrame — Premium Photography Portfolio

> **Capture · Create · Forever**

A luxury, cinematic photographer portfolio website built with **React + FastAPI**. Features dark/light theme toggle, smooth animations, filterable portfolio, album showcase, reels section, and a complete booking system.

---

## 🎨 Design Preview
Dark charcoal theme with champagne gold accents. Editorial magazine feel. Cinematic imagery, minimal typography, glassmorphism elements. Includes a **Light Mode** toggle.

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI framework + fast build |
| TypeScript | Type safety |
| TailwindCSS 3.4 | Utility-first styling |
| Framer Motion | Page + component animations |
| GSAP + ScrollTrigger | Scroll-based parallax effects |
| React Router v6 | Client-side routing |
| React Hook Form + Zod | Form handling + validation |
| Zustand | Global UI state (theme, menu, lightbox) |
| Axios | HTTP client |
| Lucide React | Icon library |
| React Day Picker | Booking calendar |
| next-themes | Dark/Light mode toggle |

### Backend
| Tech | Purpose |
|------|---------|
| Python 3.11 | Runtime |
| FastAPI | REST API framework |
| Pydantic v2 | Data validation |
| Uvicorn | ASGI server |
| python-dotenv | Env variables |
| FastAPI-Mail | Email notifications |
| CORS Middleware | Frontend ↔ Backend |

### Database
> ✅ **Integrated SQLite Database (`lensframe.db`)** — ACID-compliant persistent relational storage with WAL mode, foreign keys, and automatic initialization + seeding.

---

## 📁 Complete Project Structure

```
lensframe/
│
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   │   ├── hero/
│   │   │   ├── portfolio/
│   │   │   ├── albums/
│   │   │   ├── reels/
│   │   │   ├── profile/
│   │   │   └── testimonials/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Pill.tsx
│   │   │   │   ├── SectionHeading.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── Lightbox.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   │
│   │   │   └── sections/
│   │   │       ├── Hero.tsx
│   │   │       ├── About.tsx
│   │   │       ├── Portfolio.tsx
│   │   │       ├── Albums.tsx
│   │   │       ├── Reels.tsx
│   │   │       ├── Packages.tsx
│   │   │       ├── Booking.tsx
│   │   │       ├── Contact.tsx
│   │   │       └── Testimonials.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Albums.tsx
│   │   │   ├── Reels.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Packages.tsx
│   │   │   ├── Booking.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useScrollPosition.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useReducedMotion.ts
│   │   │   └── useTheme.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── bookingService.ts
│   │   │   ├── contactService.ts
│   │   │   └── portfolioService.ts
│   │   │
│   │   ├── store/
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── data/
│   │   │   ├── portfolio.json
│   │   │   ├── albums.json
│   │   │   ├── reels.json
│   │   │   ├── packages.json
│   │   │   └── testimonials.json
│   │   │
│   │   ├── types/
│   │   │   ├── booking.ts
│   │   │   ├── portfolio.ts
│   │   │   └── common.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── animations.ts
│   │   │   └── formatters.ts
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   │
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── booking.py
│   │   │   │   ├── contact.py
│   │   │   │   └── health.py
│   │   │   └── deps.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── logging.py
│   │   │
│   │   ├── models/
│   │   │   ├── booking.py
│   │   │   └── contact.py
│   │   │
│   │   ├── services/
│   │   │   ├── email_service.py
│   │   │   └── storage_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.py
│   │   │   └── exceptions.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   │   ├── test_booking.py
│   │   ├── test_contact.py
│   │   └── conftest.py
│   │
│   ├── .env
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/narendradodke/lensframe.git
cd lensframe
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:5173
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### 4. Environment Variables Configuration

Create `.env` files from their respective `.env.example` templates:

**`frontend/.env`**
```env
# Public backend API endpoint
VITE_API_URL=http://localhost:8000/api
VITE_SITE_NAME=LensFrame
```

**`backend/.env`**
```env
APP_NAME=LensFrame API
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_PATH=backend/lensframe.db

# Security & JWT (Must be unique and >= 32 chars in production)
JWT_SECRET=your-random-32-character-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Initial Admin Bootstrap (Used only when bootstrapping a clean database)
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_EMAIL=admin@lensframe.com
INITIAL_ADMIN_PASSWORD=your-secure-initial-password-here

# Uploads
UPLOAD_DIR=backend/uploads
MAX_UPLOAD_SIZE_MB=25

# SMTP Email Settings (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
NOTIFY_EMAIL=arjun@lensframe.com
```

---

## 🎬 UI/UX ANIMATION SPECIFICATIONS

### Global Rules
- Respect `prefers-reduced-motion: reduce`
- All transitions use `cubic-bezier(0.22, 1, 0.36, 1)`
- Default duration: 0.6s for sections, 0.3s for hovers
- Never animate more than 3 properties at once

### Animation Library

#### 1. Page Load (Hero)
```typescript
initial: { opacity: 0, y: 40 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
```

#### 2. Section Reveal
```typescript
initial: { opacity: 0, y: 60 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true, margin: "-100px" }
transition: { duration: 0.7, ease: "easeOut" }
```

#### 3. Stagger Children
```typescript
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
```

#### 4. Hover Effects
- Portfolio images: `scale(1.05)` + gold overlay fade
- Buttons: gold fill from left, text color change
- Package cards: `translateY(-8px)` + gold glow

#### 5. Parallax (Hero + Album Showcase)
```typescript
gsap.to(albumRef, {
  yPercent: -20,
  scrollTrigger: { trigger: sectionRef, start: "top bottom", end: "bottom top", scrub: 1 }
})
```

#### 6. Navbar Scroll Behavior
- ScrollY = 0 → transparent
- ScrollY > 50 → `bg-black/90 backdrop-blur-md border-b`
- Smooth 0.4s transition

#### 7. Light/Dark Mode Toggle
- Smooth color transition (0.3s)
- Store preference in `localStorage`
- Default: Dark mode
- Animated sun/moon icon

#### 8. Lightbox Modal
- Scale from 0.9 → 1 + fade backdrop
- Thumbnail sidebar with gold active border
- Keyboard navigation (Arrow keys, Esc)

#### 9. Testimonial Carousel
- Auto-play 6s, pause on hover
- Fade + slide transition
- Gold active dot

#### 10. Custom Cursor (Desktop only)
- Gold circle follower with `mix-blend-mode: difference`
- Scale 2x on hover over links

### Framer Motion Reusable Variants
```typescript
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
}
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}
```

---

## 🛡️ Admin Console & Studio Management

LensFrame includes a complete, production-grade **Admin Console** accessible at `/admin`.

### Key Capabilities:
- **Authentication & Security:** PBKDF2-HMAC-SHA256 salted password hashing, signed HS256 JWT tokens, rate limiting on login/inquiries, and role-based permissions (`superadmin`, `editor`).
- **Studio Dashboard:** Real telemetry for bookings, enquiries, content inventory, recent audit activities, and monthly booking trends.
- **Portfolio Management:** Upload, crop, edit titles, categorize (`weddings`, `haldi`, `mehndi`, `baby-shoot`), feature, and delete portfolio photos.
- **Album Management:** Create, customize spreads, upload covers, toggle featured hero spread, and toggle public visibility.
- **Reels & Video Management:** Add cinematic video files (MP4/WebM) or Instagram shortcodes with built-in preview player.
- **Packages & Investment:** Manage pricing tiers, inclusions/features builder, and "Most Popular" flags.
- **Testimonials & Memoirs:** Client review approval workflow (only approved memoirs appear on the public site).
- **Client Reservations:** Full booking manager with status transitions (`pending` → `confirmed` → `completed` → `cancelled`), internal studio notes, direct customer calling links, and one-click **CSV Dataset Export**.
- **Customer Inquiries:** Inquiries inbox with read/replied tracker and direct email reply shortcuts.
- **Administrator Roster:** Multi-admin provisioning, role management, and active status toggling.
- **Website Global Settings:** Manage Studio details, Social channels, Gallery settings, SEO tags, and administrator password rotation.

### Initial Administrator Provisioning (Bootstrap)
When bootstrapping a brand-new, empty database, the system initializes the initial lead superadmin account using values from `backend/.env`:
- **Login URL:** `http://localhost:5173/admin/login` (or `/admin`)
- **Username:** Defined by `INITIAL_ADMIN_USERNAME` (default: `admin`)
- **Initial Password:** Configured securely in `backend/.env` via `INITIAL_ADMIN_PASSWORD`.

> 🔒 **Security Best Practices:**
> - Never commit `.env` files or hardcode passwords in version control.
> - When deploying with `ENVIRONMENT=production`, the application strictly enforces:
>   - `JWT_SECRET` must be non-default and at least 32 characters.
>   - `INITIAL_ADMIN_PASSWORD` must be non-default and at least 8 characters.
>   - `DEBUG` must be set to `False`.
> - Always rotate your administrative password immediately upon initial deployment via **Admin Console > Settings > Security** (`/admin/settings`).

---

## 🔒 Security Operations & Administration

### 1. Password Rotation Procedure
Administrators can securely rotate their password at any time:
1. Log into the studio admin workspace at `/admin`.
2. Navigate to **Settings** (`/admin/settings`) and select the **Security** tab.
3. Enter your current password, specify your new strong password (minimum 8 characters with mixed case, numbers, and symbols), and submit.
4. The backend securely verifies the existing password, salts and hashes the new password with PBKDF2-HMAC-SHA256 (100,000 rounds), updates the database, and records an audit log entry.

### 2. Secret Rotation Procedure (Compromise Recovery)
If `JWT_SECRET` or any server credential is ever suspected of exposure:
1. Generate a new high-entropy 32+ character random secret (e.g. `openssl rand -hex 32`).
2. Update `JWT_SECRET` in `backend/.env` (or your production hosting environment secrets manager).
3. Restart the backend process (`uvicorn app.main:app`).
4. **Immediate Effect:** All previously issued JWT bearer tokens are instantly invalidated cryptographically without database changes. All administrators will be safely prompted to re-authenticate.

### 3. Database Backup & Disaster Recovery (SQLite)
The application uses SQLite in Write-Ahead Logging (WAL) mode with foreign key constraints.
- **Online Hot Backup:**
  Use the safe SQLite online backup API to take a live snapshot without locking writers:
  ```bash
  # Linux / macOS
  sqlite3 backend/lensframe.db ".backup 'backend/backups/lensframe_$(date +%Y%m%d_%H%M%S).db'"

  # Windows PowerShell
  sqlite3 backend\lensframe.db ".backup 'backend\backups\lensframe_backup.db'"
  ```
- **Disaster Recovery:**
  To restore from backup:
  1. Stop the backend server process.
  2. Copy the backup file over `backend/lensframe.db`.
  3. Remove any lingering `-shm` or `-wal` companion files (`backend/lensframe.db-shm`, `backend/lensframe.db-wal`).
  4. Restart the backend server process.

---

---

## 🔌 Backend API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check & service status |
| GET | `/api/portfolio` | Filterable public portfolio photos |
| GET | `/api/albums` | Public featured & carousel album spreads |
| GET | `/api/reels` | Published public reels & cinematics |
| GET | `/api/packages` | Active pricing packages & inclusions |
| GET | `/api/testimonials` | Approved client reviews |
| GET | `/api/settings/public` | Public site information & social links |
| POST | `/api/booking` | Submit client shoot reservation (rate-limited) |
| POST | `/api/contact` | Send customer inquiry message (rate-limited) |

### Admin Endpoints (Protected by Bearer Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate admin & receive JWT |
| GET | `/api/auth/me` | Fetch authenticated admin profile |
| POST | `/api/auth/change-password` | Rotate admin password |
| GET | `/api/admin/dashboard/stats` | Real-time studio stats & analytics |
| GET/POST | `/api/admin/portfolio` | List (paginated/filtered) & create photos |
| PUT/DELETE | `/api/admin/portfolio/{id}` | Update metadata or delete photo |
| POST | `/api/admin/portfolio/reorder` | Update gallery sequence order |
| GET/POST | `/api/admin/albums` | List all albums & create spread |
| PUT/DELETE | `/api/admin/albums/{id}` | Update spread, set featured, or delete |
| GET/POST | `/api/admin/reels` | List all reels & add video reel |
| PUT/DELETE | `/api/admin/reels/{id}` | Update or delete video reel |
| GET/POST | `/api/admin/packages` | List & configure package pricing tiers |
| PUT/DELETE | `/api/admin/packages/{id}` | Update inclusions, rates, or delete |
| GET/POST | `/api/admin/testimonials` | List & create client reviews |
| PUT/DELETE | `/api/admin/testimonials/{id}` | Toggle approval or delete review |
| GET | `/api/admin/bookings` | Filtered bookings list (paginated) |
| GET/PUT | `/api/admin/bookings/{id}` | View details & update status / notes |
| GET | `/api/admin/bookings/export/csv` | Download bookings dataset as CSV |
| GET/PUT/DELETE | `/api/admin/contacts` | Manage customer inquiry messages |
| GET/POST/PUT/DELETE | `/api/admin/users` | Manage administrator accounts (Superadmin) |
| GET/PUT | `/api/admin/settings` | Retrieve & update website settings |
| POST | `/api/admin/upload` | Upload image (JPG, PNG, WebP) or video (MP4) |

### Example: Booking Request
```json
POST /api/booking
{
  "full_name": "Riya Sharma",
  "email": "riya@example.com",
  "phone": "+91 9876543210",
  "event_date": "2025-12-15",
  "event_type": "wedding",
  "package_tier": "premium",
  "message": "Looking for full-day coverage"
}
```

---

## 🚀 Build & Deploy

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Deploy Suggestions
- **Frontend:** Vercel / Netlify
- **Backend:** Railway / Render / Fly.io
- **Images:** Cloudinary / AWS S3

---

## 📝 License
MIT © LensFrame
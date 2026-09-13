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
> ⏳ **Coming Soon** — Currently using mock JSON data in `/data/`. Will integrate **PostgreSQL + SQLAlchemy** later.

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

### 4. Environment Variables

**frontend/.env**
```
VITE_API_URL=http://localhost:8000/api
VITE_SITE_NAME=LensFrame
```

**backend/.env**
```
APP_NAME=LensFrame API
DEBUG=True
CORS_ORIGINS=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASSWORD=your_app_password
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

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/portfolio` | Get all portfolio items |
| GET | `/api/portfolio?category=wedding` | Filter by category |
| GET | `/api/albums` | Get all albums |
| GET | `/api/reels` | Get all reels |
| GET | `/api/packages` | Get all packages |
| POST | `/api/booking` | Create new booking |
| POST | `/api/contact` | Send contact message |

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
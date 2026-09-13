# ✅ PROJECT TASKS — LensFrame Photography Website

> Status Legend: `[ ]` Pending · `[~]` In Progress · `[x]` Done · `[!]` Blocked

---

## 🏗️ PHASE 1: PROJECT SETUP

### Task 1.1 — Repository Setup
- [ ] Create GitHub repo `lensframe`
- [ ] Add `.gitignore` (node_modules, venv, .env, dist, __pycache__)
- [ ] Add `LICENSE` (MIT)
- [ ] Create `frontend/` and `backend/` folders
- [ ] Initial commit

**Commit:** `chore: initialize lensframe project structure`

### Task 1.2 — Frontend Scaffold
- [ ] `npm create vite@latest frontend -- --template react-ts`
- [ ] Install: tailwind, framer-motion, gsap, react-router-dom, axios, react-hook-form, zod, zustand, lucide-react, next-themes, react-day-picker
- [ ] Configure Tailwind (colors, fonts, keyframes)
- [ ] Setup fonts: Playfair Display, Inter, Great Vibes
- [ ] Folder structure per README

**Commit:** `feat(frontend): scaffold vite + react + ts + tailwind`

### Task 1.3 — Backend Scaffold
- [ ] Create venv + activate
- [ ] Install: fastapi, uvicorn, pydantic, python-dotenv, fastapi-mail, python-multipart
- [ ] Setup FastAPI app + CORS
- [ ] Health check `/api/health`
- [ ] `pip freeze > requirements.txt`

**Commit:** `feat(backend): scaffold fastapi app with health endpoint`

---

## 🎨 PHASE 2: DESIGN SYSTEM & UI PRIMITIVES

### Task 2.1 — Global Styles + Theme Setup
- [ ] `globals.css` with base resets
- [ ] Grain texture overlay
- [ ] Custom scrollbar (dark + gold)
- [ ] Selection color (gold)
- [ ] `prefers-reduced-motion` support
- [ ] Setup `next-themes` for Light/Dark toggle
- [ ] Define CSS variables for both themes

**Commit:** `style: add global styles and dark/light theme setup`

### Task 2.2 — Reusable UI Components
- [ ] `Button.tsx` (primary, outline, ghost)
- [ ] `Input.tsx` + `Textarea.tsx`
- [ ] `Card.tsx`
- [ ] `Modal.tsx`
- [ ] `Pill.tsx` (filter tabs)
- [ ] `SectionHeading.tsx`
- [ ] `Loader.tsx`
- [ ] `ThemeToggle.tsx` (sun/moon icon)
- [ ] `Lightbox.tsx`

**Commit:** `feat(ui): add reusable components including theme toggle and lightbox`

### Task 2.3 — Animation Utilities
- [ ] `utils/animations.ts` (fadeUp, fadeIn, stagger, scaleIn)
- [ ] `hooks/useReducedMotion.ts`
- [ ] `hooks/useScrollPosition.ts`
- [ ] `hooks/useMediaQuery.ts`

**Commit:** `feat(animations): add framer motion variants and hooks`

---

## 🖼️ PHASE 3: SECTIONS BUILD (One commit per section)

### Task 3.1 — Navbar + Mobile Menu
- [ ] Sticky navbar with scroll behavior
- [ ] Logo "LensFrame" + tagline
- [ ] Menu links + Theme toggle
- [ ] Mobile hamburger + drawer
- [ ] Zustand store for menu state

**Commit:** `feat(navbar): add sticky navbar with mobile drawer and theme toggle`

### Task 3.2 — Hero Section
- [ ] Full-screen cinematic image
- [ ] "Turning Moments into Memories" heading
- [ ] "Every Frame Has A Story" cursive overlay
- [ ] Stats row + Social icons
- [ ] Scroll indicator

**Commit:** `feat(hero): add cinematic hero with stats and social icons`

### Task 3.3 — About Section
- [ ] "Hi, I'm Arjun Sharma" heading
- [ ] Bio + Stats row
- [ ] Signature (Great Vibes font)
- [ ] Profile image + Skills progress bars

**Commit:** `feat(about): add about section with skills bars and signature`

### Task 3.4 — Portfolio Gallery
- [ ] Filter tabs (All, Weddings, Portraits, Travel, Events)
- [ ] Masonry grid with stagger animation
- [ ] Hover overlay + Lightbox
- [ ] Load More button

**Commit:** `feat(portfolio): add filterable gallery with lightbox`

### Task 3.5 — Albums Section
- [ ] Featured album card (Royal Wedding)
- [ ] Horizontal album carousel (Classic, Modern, Vintage, Luxury)
- [ ] Carousel arrows

**Commit:** `feat(albums): add wedding albums carousel`

### Task 3.6 — Reels Section
- [ ] 4 vertical video cards (9:16)
- [ ] Play button + duration badge
- [ ] Title + photo count

**Commit:** `feat(reels): add vertical reels and videos section`

### Task 3.7 — Packages Section
- [ ] 3 pricing cards (Basic ₹12,000, Premium ₹22,000, Luxury ₹35,000)
- [ ] Premium highlighted with gold border + "Most Popular" badge
- [ ] Hover lift + gold glow

**Commit:** `feat(packages): add pricing cards with highlighted premium plan`

### Task 3.8 — Booking Form
- [ ] Split layout (image + form)
- [ ] React Hook Form + Zod validation
- [ ] Date picker (dark themed)
- [ ] API integration
- [ ] Success toast

**Commit:** `feat(booking): add booking form with validation and api`

### Task 3.9 — Contact Section
- [ ] Contact info (phone, email, location)
- [ ] Google Maps embed
- [ ] Contact form with validation

**Commit:** `feat(contact): add contact section with map and form`

### Task 3.10 — Testimonials
- [ ] Floating testimonial card
- [ ] 5 gold stars
- [ ] Auto-play carousel

**Commit:** `feat(testimonials): add testimonial carousel with gold stars`

### Task 3.11 — Footer
- [ ] Logo + tagline
- [ ] Quick Links + Services + Newsletter
- [ ] Copyright bar + Social icons

**Commit:** `feat(footer): add footer with newsletter and social links`

---

## 🔌 PHASE 4: BACKEND API

### Task 4.1 — Booking Endpoint
- [ ] Pydantic model for Booking
- [ ] POST `/api/booking` with validation
- [ ] Email notification (FastAPI-Mail)
- [ ] Return 201 with booking ID

**Commit:** `feat(api): add booking endpoint with email notification`

### Task 4.2 — Contact Endpoint
- [ ] POST `/api/contact`
- [ ] Email forward to owner
- [ ] Rate limiting (slowapi)

**Commit:** `feat(api): add contact endpoint with rate limiting`

### Task 4.3 — Mock Data Endpoints
- [ ] GET `/api/portfolio` (from JSON)
- [ ] GET `/api/albums`
- [ ] GET `/api/reels`
- [ ] GET `/api/packages`

**Commit:** `feat(api): add mock data endpoints for portfolio sections`

---

## 🔒 PHASE 5: SECURITY

### Task 5.1 — Frontend Security
- [ ] Sanitize user inputs
- [ ] CSP headers
- [ ] No secrets in frontend `.env`
- [ ] `npm audit fix`
- [ ] `referrerPolicy="no-referrer"` on external images

**Commit:** `security(frontend): add csp headers and sanitize inputs`

### Task 5.2 — Backend Security
- [ ] CORS whitelist
- [ ] Rate limiting on POST endpoints (slowapi)
- [ ] Pydantic strict types
- [ ] Hide stack traces in production
- [ ] Security headers (HSTS, X-Frame-Options)
- [ ] Email regex + phone validation
- [ ] Honeypot field in forms
- [ ] reCAPTCHA v3 (optional)

**Commit:** `security(backend): add rate limiting and security headers`

### Task 5.3 — Dependency Security
- [ ] Enable Dependabot on GitHub
- [ ] Run `npm audit` weekly
- [ ] Run `pip-audit` weekly

**Commit:** `chore(security): enable dependabot for automated updates`

---

## 🐛 PHASE 6: BUG FIXES & ERROR HANDLING

### Task 6.1 — Frontend Error Handling
- [ ] Error Boundary component
- [ ] API failure toast
- [ ] 404 NotFound page
- [ ] Loading skeletons
- [ ] Axios retry logic
- [ ] Form error inline display

**Commit:** `fix(frontend): add error boundary and loading skeletons`

### Task 6.2 — Backend Error Handling
- [ ] Global exception handler
- [ ] Custom exception classes
- [ ] Proper HTTP status codes (400, 404, 422, 500)
- [ ] Structured error responses
- [ ] Logging to file + console

**Commit:** `fix(backend): add global exception handler and structured errors`

### Task 6.3 — Known Bugs
- [ ] Mobile menu scroll lock
- [ ] Date picker timezone issue
- [ ] Carousel autoplay on tab focus
- [ ] Image lazy load flicker
- [ ] Framer Motion Safari backdrop-filter bug
- [ ] Double form submit on slow network
- [ ] Theme toggle flash on page load (FOUC)

**Commit:** `fix: resolve mobile menu, safari animation and theme flash bugs`

---

## 🧪 PHASE 7: TESTING

### Task 7.1 — Frontend Tests
- [ ] Setup Vitest + React Testing Library
- [ ] Test Button, Input, Modal, ThemeToggle
- [ ] Test Booking form validation
- [ ] Test Portfolio filter logic
- [ ] Test Navbar mobile toggle

**Commit:** `test(frontend): add unit tests for ui components and forms`

### Task 7.2 — Backend Tests
- [ ] Setup pytest + httpx
- [ ] Test `/api/health`
- [ ] Test booking POST (valid + invalid)
- [ ] Test contact POST
- [ ] Test rate limiter

**Commit:** `test(backend): add pytest suite for api endpoints`

### Task 7.3 — E2E Tests
- [ ] Setup Playwright
- [ ] Test full booking flow
- [ ] Test navigation + theme toggle
- [ ] Test mobile responsiveness

**Commit:** `test(e2e): add playwright tests for booking and navigation`

### Task 7.4 — Manual QA
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iPhone, Android, iPad
- [ ] Test slow 3G
- [ ] Keyboard-only navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] Lighthouse score > 90

**Commit:** `chore(qa): manual cross-browser and accessibility testing`

---

## 🚀 PHASE 8: OPTIMIZATION

### Task 8.1 — Performance
- [ ] Image optimization (WebP + AVIF)
- [ ] Lazy load all images
- [ ] Code splitting per route
- [ ] Preload hero image
- [ ] Bundle size analysis (vite-plugin-visualizer)
- [ ] Gzip/Brotli compression

**Commit:** `perf: optimize images, code split routes and reduce bundle`

### Task 8.2 — SEO
- [ ] Meta tags (title, description, OG, Twitter)
- [ ] Sitemap.xml + robots.txt
- [ ] Structured data (JSON-LD LocalBusiness)
- [ ] Alt text on all images

**Commit:** `seo: add meta tags, sitemap and structured data`

### Task 8.3 — Accessibility
- [ ] Keyboard accessible interactive elements
- [ ] Focus visible styles (gold outline)
- [ ] ARIA labels on icon buttons
- [ ] Color contrast > 4.5:1 in both themes
- [ ] Skip to content link

**Commit:** `a11y: add aria labels, focus styles and skip link`

---

## 📦 PHASE 9: DEPLOYMENT

### Task 9.1 — Frontend Deploy (Vercel)
- [ ] Connect GitHub repo
- [ ] Set env variables
- [ ] Custom domain + SSL

**Commit:** `chore(deploy): configure vercel deployment`

### Task 9.2 — Backend Deploy (Railway)
- [ ] Create Railway project
- [ ] Set env variables
- [ ] Start command + health check

**Commit:** `chore(deploy): configure railway deployment`

### Task 9.3 — Post-Deploy Checks
- [ ] Test live booking flow
- [ ] Test email delivery
- [ ] Verify CORS
- [ ] Check logs
- [ ] Run Lighthouse on live URL

**Commit:** `chore: post-deployment verification completed`

---

## 🎯 FUTURE (Phase 10 — Later)

- [ ] PostgreSQL + SQLAlchemy integration
- [ ] Admin dashboard (view bookings)
- [ ] Client login + gallery access
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] Cloudinary for image hosting
- [ ] Multi-language (Hindi + English)
- [ ] WhatsApp integration
- [ ] Instagram feed embed

---

## 📋 GITHUB WORKFLOW

### Branch Strategy
- `main` → production (protected)
- `develop` → staging
- `feat/*` → new features
- `fix/*` → bug fixes
- `chore/*` → setup/config

### Commit Convention
```
feat(scope):     new feature
fix(scope):      bug fix
style(scope):    formatting
refactor(scope): code restructure
test(scope):     tests
chore(scope):    tooling/config
security(scope): security fix
perf(scope):     performance
a11y(scope):     accessibility
seo(scope):      seo
```

### Daily Push Routine
```bash
git checkout develop
git pull origin develop
git checkout -b feat/booking-form
# ... work ...
git add .
git commit -m "feat(booking): add booking form with zod validation"
git push origin feat/booking-form
# Open PR → review → merge to develop
```

### PR Checklist
- [ ] Code builds locally
- [ ] No console errors
- [ ] Tests pass
- [ ] Screenshots attached
- [ ] Responsive on mobile
- [ ] No hardcoded secrets
- [ ] Lighthouse score maintained

---

## ✅ FINAL LAUNCH CHECKLIST

- [ ] All Phase 1–9 tasks complete
- [ ] Lighthouse > 90 (Performance, A11y, SEO, Best Practices)
- [ ] Zero console errors on live site
- [ ] Booking flow works end-to-end
- [ ] Emails delivering
- [ ] Mobile perfect
- [ ] Custom domain live with HTTPS
- [ ] Analytics added (Plausible / GA4)
- [ ] README updated with live URLs
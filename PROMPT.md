# 🎯 MASTER PROMPT — LensFrame Photography Website

## ROLE
You are a Senior Full-Stack Developer + UI/UX Designer. Build a premium, cinematic, award-winning photographer portfolio website named **"LensFrame"** based on the provided design mockup. Write clean, production-ready code with pixel-perfect design implementation and smooth animations.

## PROJECT OVERVIEW
Build a luxury photography portfolio website with a **dark theme (default)** and a **light mode toggle**. It must feel high-end, editorial, and cinematic. The website name is **LensFrame** with the tagline "Capture · Create · Forever". The photographer's name is **Arjun Sharma**.

## DESIGN SYSTEM (STRICT — Follow Exactly)

### Colors (Dark Mode — Default)
- Primary Background:    #0A0A0A
- Secondary Background:  #141414 (Cards)
- Accent Gold:           #D4AF37
- Accent Gold Hover:     #E6C558
- Text Primary:          #FFFFFF
- Text Secondary:        #A1A1A1
- Border Subtle:         #262626

### Colors (Light Mode)
- Primary Background:    #F8F8F8
- Secondary Background:  #FFFFFF (Cards)
- Accent Gold:           #C59B27
- Text Primary:          #111111
- Text Secondary:        #555555
- Border Subtle:         #E0E0E0

### Typography
- Headings:   'Playfair Display', serif (weights 400, 600, 700)
- Body:       'Inter', sans-serif (weights 300, 400, 500, 600)
- Cursive Accent: 'Great Vibes', cursive (for quotes like "Every Frame Has A Story")

### Spacing & Layout
- Container: max-w-7xl mx-auto px-6 lg:px-12
- Section padding: py-20 lg:py-32
- Border radius: rounded-none for images (editorial), rounded-full for buttons/pills

## SECTIONS TO BUILD (In Order)

### 1. Navigation Bar (Sticky)
- Logo: Camera icon + "LensFrame" (serif) + "Capture · Create · Forever" (tiny caps)
- Menu Links: Home, About, Portfolio, Albums, Reels, Packages, Booking, Contact
- Right: Light/Dark toggle icon
- Mobile: Hamburger menu with full-screen slide-in drawer
- Transparent on top → solid black on scroll

### 2. Hero Section
- Full viewport height
- Background: Cinematic photographer silhouette at sunset with camera
- Small tag: "PROFESSIONAL PHOTOGRAPHER" (gold, tracking-widest)
- Heading: "Turning Moments into Memories" — "Moments" in gold
- Subtext: "I'm a passionate photographer who believes in the power of real moments..."
- Buttons: "View My Work →" (gold filled) + "About Me" (outline with play icon)
- Cursive overlay on right: "Every Frame Has A Story" (gold)
- Scroll Down indicator
- Bottom stats row: 500+ Happy Clients | 1000+ Photos Captured | 5+ Years Experience
- Left vertical social icons (Instagram, YouTube, Facebook, X)

### 3. About Section
- Tag: "ABOUT ME" (gold, small caps)
- Heading: "Hi, I'm Arjun Sharma" (Arjun in gold)
- Subheading: "Photographer & Visual Storyteller"
- Bio paragraph
- Buttons: "View My Work →" + "About Me"
- Stats row with icons: 5+ Years Experience | 500+ Happy Clients | 1000+ Photos Captured
- Signature: "Arjun Sharma" (Great Vibes font)
- Right side: Profile image (rounded) + Skills progress bars:
  - Photography: 95%
  - Photo Editing: 90%
  - Video Editing: 85%
  - Creative Direction: 80%
- Gold "→" arrow button bottom right

### 4. Portfolio Section ("My Best Work")
- Filter tabs (pill design, gold active): All | Weddings | Portraits | Travel | Events
- Masonry/Editorial grid layout with 8-10 images
- Hover effect: Image zoom + gold overlay + category tag + arrow icon
- Lightbox modal: Full image on left, thumbnail sidebar on right, close X button, prev/next arrows

### 5. Albums Section ("Wedding Albums")
- Section heading "Wedding Albums" + subtext + "View All Albums →" link
- Main featured album card: Large image (Royal Wedding) with "Premium Album" badge + "30 Photos" tag
- Below: Horizontal scrolling row of 4 album cards:
  - Classic (50 Photos)
  - Modern (60 Photos)
  - Vintage (40 Photos)
  - Luxury (70 Photos)
- Left/right carousel arrows

### 6. Reels & Videos Section
- Heading "Reels & Videos" + subtext + "View All →" link
- 4 vertical video cards (9:16 aspect ratio) with:
  - Play button overlay
  - Duration badge (e.g., "1:12")
  - Title: Travel Vibes, Behind The Scenes, Wedding Highlights, Nature Vibes
  - Photo count (e.g., "80 Photos")

### 7. Packages Section ("Choose Your Perfect Package")
- Heading + subtext
- 3 pricing cards:
  - Basic — ₹12,000 (Perfect for small ceremonies)
    - 4 Hours Coverage
    - 200+ Edited Photos
    - Online Gallery (1 Year)
    - 1 Album (20 Pages)
  - Premium — ₹22,000 (Most Popular — highlighted with gold border + badge)
    - 8 Hours Coverage
    - 500+ Edited Photos
    - Cinematic Video (2-5 min)
    - 2 Albums (40 Pages)
    - All Files (Google Drive)
  - Luxury — ₹35,000 (The ultimate experience)
    - Full Day Coverage
    - 1000+ Edited Photos
    - Cinematic Video (5-8 min)
    - 3 Albums (80 Pages)
    - Drone Shots (if possible)
    - Online Gallery + USB
- Each card has "Book Now" button (gold for Premium, outline for others)

### 8. Booking Section ("Book Your Shoot")
- Left side: Image with overlay text "Let's Capture Your Story"
- Right side: Form with fields:
  - Full Name *
  - Phone Number * (with +91 prefix)
  - Select Package * (dropdown)
  - Date of Shoot * (date picker)
  - Additional Message (textarea)
- "Confirm Booking →" gold filled button
- React Hook Form + Zod validation

### 9. Contact Section ("Get In Touch")
- Heading + subtext "Have a question or want to book a shoot? I'd love to hear from you."
- Left side:
  - Phone: +91 98765 43210 (Mon-Sun, 9AM-8PM)
  - Email: arjun@lensframe.com (We reply within 24 hours)
  - Location: Indore, Madhya Pradesh (Available pan India)
  - Google Maps embed
- Right side: Form (Your Name, Email Address, Message, "Send Message →" button)

### 10. Footer
- Logo + tagline
- Columns: Quick Links (Home, About, Portfolio, Albums, Reels, Packages, Booking, Contact) | Services (Wedding Photography, Portrait Photography, Event Coverage, Cinematic Videography) | Subscribe (Email input + gold arrow button)
- Bottom bar: "© 2025 LensFrame. All rights reserved." + Privacy Policy | Terms & Conditions
- Social icons (Instagram, YouTube, Facebook, X, LinkedIn)

### 11. Floating Elements
- Light/Dark mode toggle (bottom right)
- Testimonial floating card with 5 gold stars
- Mobile mockup showing responsive design

## TECH STACK (MANDATORY)
- Frontend:  React 18 + Vite + TypeScript
- Styling:   TailwindCSS 3.4+ (no CSS-in-JS)
- Animation: Framer Motion + GSAP (for scroll triggers & parallax)
- Routing:   React Router v6
- Forms:     React Hook Form + Zod validation
- Icons:     Lucide React
- State:     Zustand (theme, mobile menu, lightbox)
- API Calls: Axios with interceptors
- Backend:   Python 3.11 + FastAPI + Pydantic v2 + Uvicorn
- Email:     SMTP / SendGrid (for booking notifications)
- Env:       python-dotenv
- Theme:     next-themes (or custom hook for dark/light toggle)

## DATABASE
> ⏳ SKIP FOR NOW. Use mock JSON data in `/data/` folder. Will integrate PostgreSQL + SQLAlchemy later.

## CODE QUALITY RULES
1. Component-based architecture (1 component = 1 file)
2. Responsive mobile-first design
3. Semantic HTML5 tags
4. Lazy load all images
5. Proper aria-labels on icon buttons
6. No inline styles — only Tailwind classes
7. Reusable UI in `/components/ui/`
8. Custom hooks in `/hooks/`
9. API calls only in `/services/`
10. TypeScript types in `/types/`
11. Respect `prefers-reduced-motion`
12. No console.log in production

## DELIVERABLE
Build the complete LensFrame website with all 11 sections, fully functional frontend, working backend API for booking + contact, dark/light theme toggle, and production-ready code.
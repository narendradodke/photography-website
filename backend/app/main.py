import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.database import init_db
from app.api.routes import health, booking, contact, data, auth, admin

# Validate configuration if in production
settings.validate_production_config()

# Initialize database and upload folders
init_db()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for LensFrame — Arjun Sharma Photography Portfolio & Admin Management",
    version="2.0.0"
)

# HTTP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS Middleware configuration
safe_origins = settings.cors_list if settings.cors_list else ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=safe_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static media files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(booking.router, prefix="/api", tags=["Booking"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(data.router, prefix="/api", tags=["Content"])

@app.get("/")
def root():
    return {
        "message": "Welcome to LensFrame Photography API",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

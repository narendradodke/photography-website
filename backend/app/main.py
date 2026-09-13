from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, booking, contact, data

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for LensFrame — Arjun Sharma Photography Portfolio",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(booking.router, prefix="/api", tags=["Booking"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(data.router, prefix="/api", tags=["Content"])

@app.get("/")
def root():
    return {
        "message": "Welcome to LensFrame API",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

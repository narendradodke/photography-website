import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.dirname(APP_DIR)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")
    
    APP_NAME: str = "LensFrame API"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    
    # Database
    DATABASE_PATH: str = os.path.join(BACKEND_DIR, "lensframe.db")
    
    # Security
    JWT_SECRET: str = "lensframe-super-secret-key-change-in-production-2026-secure-token"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24
    
    # Default Bootstrap Admin
    INITIAL_ADMIN_USERNAME: str = "admin"
    INITIAL_ADMIN_EMAIL: str = "admin@lensframe.com"
    INITIAL_ADMIN_PASSWORD: str = "LensFrame@2026!"
    
    # Uploads
    UPLOAD_DIR: str = os.path.join(BACKEND_DIR, "uploads")
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # Notification & Mail
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    NOTIFY_EMAIL: str = "arjun@lensframe.com"

    # Environment
    ENVIRONMENT: str = "development"

    @property
    def is_production(self) -> bool:
        return (
            self.ENVIRONMENT.lower() == "production" or
            os.getenv("ENVIRONMENT", "").lower() == "production"
        )

    def validate_production_config(self) -> None:
        """Strict security validation for production mode."""
        if not self.is_production:
            return

        errors = []
        KNOWN_INSECURE_JWT = {
            "lensframe-super-secret-key-change-in-production-2026-secure-token",
            "replace-with-a-random-secure-secret-key-at-least-32-chars",
            "change-me-in-production",
            "secret",
        }
        if not self.JWT_SECRET or not self.JWT_SECRET.strip():
            errors.append("Production deployment requires a non-empty JWT_SECRET.")
        elif self.JWT_SECRET in KNOWN_INSECURE_JWT:
            errors.append("Production deployment requires a unique, non-default JWT_SECRET.")
        elif len(self.JWT_SECRET) < 32:
            errors.append("JWT_SECRET must be at least 32 characters in production.")

        KNOWN_INSECURE_PASSWORDS = {
            "LensFrame@2026!",
            "ChangeThisPasswordPromptly123!",
            "admin",
            "admin123",
            "password",
            "changeme",
        }
        if not self.INITIAL_ADMIN_PASSWORD or not self.INITIAL_ADMIN_PASSWORD.strip():
            errors.append("Production deployment requires an explicitly configured INITIAL_ADMIN_PASSWORD.")
        elif self.INITIAL_ADMIN_PASSWORD in KNOWN_INSECURE_PASSWORDS:
            errors.append("Production deployment requires an explicitly configured, non-default INITIAL_ADMIN_PASSWORD.")
        elif len(self.INITIAL_ADMIN_PASSWORD) < 8:
            errors.append("INITIAL_ADMIN_PASSWORD must be at least 8 characters in production.")

        if self.DEBUG is True:
            errors.append("DEBUG must be set to False in production.")

        if errors:
            raise ValueError("Production Configuration Security Errors:\n- " + "\n- ".join(errors))

    @property
    def cors_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()

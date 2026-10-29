import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any, Dict, Optional
from datetime import datetime, timezone
from app.core.config import settings

def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def b64url_decode(s: str) -> bytes:
    padding = "=" * (4 - len(s) % 4) if len(s) % 4 else ""
    return base64.urlsafe_b64decode(s + padding)

def hash_password(password: str) -> str:
    """Generate salted PBKDF2-HMAC-SHA256 password hash."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return f"{salt}${key.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against salted PBKDF2-HMAC-SHA256 hash using constant-time comparison."""
    try:
        salt, expected_hex = hashed.split("$", 1)
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
        return hmac.compare_digest(key.hex(), expected_hex)
    except Exception:
        return False

def create_access_token(payload: Dict[str, Any], expires_hours: Optional[int] = None) -> str:
    """Create signed HS256 JWT."""
    exp_hours = expires_hours or settings.JWT_EXPIRE_HOURS
    now = int(time.time())
    token_payload = {
        **payload,
        "iat": now,
        "exp": now + (exp_hours * 3600)
    }
    
    header = {"alg": settings.JWT_ALGORITHM, "typ": "JWT"}
    h_b64 = b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    p_b64 = b64url_encode(json.dumps(token_payload, separators=(",", ":")).encode("utf-8"))
    
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    sig = hmac.new(settings.JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = b64url_encode(sig)
    
    return f"{h_b64}.{p_b64}.{sig_b64}"

def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and verify signed HS256 JWT."""
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid token format")
    
    h_b64, p_b64, sig_b64 = parts
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    expected_sig = hmac.new(settings.JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
    
    if not hmac.compare_digest(b64url_encode(expected_sig), sig_b64):
        raise ValueError("Invalid token signature")
    
    payload = json.loads(b64url_decode(p_b64).decode("utf-8"))
    
    if "exp" in payload and payload["exp"] < time.time():
        raise ValueError("Token has expired")
    
    return payload


# --- Rate Limiting Helper ---
class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        # Clean expired
        timestamps = [t for t in self.requests.get(key, []) if t > cutoff]
        if len(timestamps) >= self.max_requests:
            self.requests[key] = timestamps
            return False
        timestamps.append(now)
        self.requests[key] = timestamps
        return True

# Rate limiters
login_rate_limiter = RateLimiter(max_requests=5, window_seconds=300) # 5 attempts per 5 minutes
public_submission_rate_limiter = RateLimiter(max_requests=10, window_seconds=60) # 10 submissions per minute


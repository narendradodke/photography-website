from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Dict, Any
from app.core.security import verify_password, hash_password, create_access_token, login_rate_limiter
from app.db import repository
from app.models.admin import LoginRequest, LoginResponse, AdminOut, PasswordChangeRequest
from app.api.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["Admin Authentication"])

@router.post("/login", response_model=LoginResponse)
def admin_login(payload: LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{client_ip}:{payload.username.lower()}"

    if not login_rate_limiter.is_allowed(rate_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 5 minutes before trying again.",
        )

    admin = repository.get_admin_by_username(payload.username.strip())
    if not admin or not verify_password(payload.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    if not admin.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is disabled. Please contact the lead administrator.",
        )

    # Update last login timestamp
    repository.update_admin_last_login(admin["id"])

    # Create signed token
    token = create_access_token({
        "sub": admin["username"],
        "role": admin["role"],
        "id": admin["id"],
    })

    # Log audit entry
    repository.log_activity(
        admin_username=admin["username"],
        action="LOGIN",
        entity_type="auth",
        entity_id=str(admin["id"]),
        details=f"Successful admin login from {client_ip}",
        ip_address=client_ip
    )

    admin_out = AdminOut(
        id=admin["id"],
        username=admin["username"],
        email=admin["email"],
        role=admin["role"],
        full_name=admin.get("full_name") or "",
        is_active=bool(admin.get("is_active")),
        created_at=admin["created_at"],
        last_login=admin.get("last_login")
    )

    return LoginResponse(
        token=token,
        admin=admin_out
    )

@router.get("/me", response_model=AdminOut)
def get_current_admin_profile(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    return AdminOut(
        id=current_admin["id"],
        username=current_admin["username"],
        email=current_admin["email"],
        role=current_admin["role"],
        full_name=current_admin.get("full_name") or "",
        is_active=bool(current_admin.get("is_active")),
        created_at=current_admin["created_at"],
        last_login=current_admin.get("last_login")
    )

@router.post("/change-password")
def change_admin_password(
    payload: PasswordChangeRequest,
    request: Request,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    admin = repository.get_admin_by_id(current_admin["id"])
    if not admin or not verify_password(payload.current_password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    new_hash = hash_password(payload.new_password)
    repository.update_admin_password(current_admin["id"], new_hash)

    client_ip = request.client.host if request.client else ""
    repository.log_activity(
        admin_username=current_admin["username"],
        action="CHANGE_PASSWORD",
        entity_type="auth",
        entity_id=str(current_admin["id"]),
        details="Password rotated successfully",
        ip_address=client_ip
    )

    return {"success": True, "message": "Password updated successfully."}

@router.post("/logout")
def admin_logout(
    request: Request,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    client_ip = request.client.host if request.client else ""
    repository.log_activity(
        admin_username=current_admin["username"],
        action="LOGOUT",
        entity_type="auth",
        entity_id=str(current_admin["id"]),
        details="Admin logged out",
        ip_address=client_ip
    )
    return {"success": True, "message": "Logged out successfully."}


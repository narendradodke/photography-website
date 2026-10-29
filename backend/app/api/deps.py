from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Dict, Any
from app.core.security import decode_access_token
from app.db import repository

security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication credentials invalid or expired: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject identity",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    admin = repository.get_admin_by_username(username)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found or has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive. Contact Lead Administrator.",
        )
    
    return admin

def require_superadmin(current_admin: Dict[str, Any] = Depends(get_current_admin)) -> Dict[str, Any]:
    if current_admin.get("role") != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Superadmin role privileges required for this operation",
        )
    return current_admin


from fastapi import APIRouter, HTTPException, Request, status
from app.models.booking import ContactCreate, ContactResponse
from app.services.storage_service import storage_service
from app.core.security import public_submission_rate_limiter

router = APIRouter()

@router.post("/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not public_submission_rate_limiter.is_allowed(f"contact:{client_ip}"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many message submissions. Please wait a moment before trying again."
        )

    try:
        storage_service.create_contact(payload.model_dump())
        return ContactResponse(
            success=True,
            message="Thank you for your message. We look forward to connecting with you soon."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record message: {str(e)}")

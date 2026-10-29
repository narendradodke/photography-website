from fastapi import APIRouter, HTTPException, Request, status
from app.models.booking import BookingCreate, BookingResponse
from app.services.storage_service import storage_service
from app.core.security import public_submission_rate_limiter

router = APIRouter()

@router.post("/booking", response_model=BookingResponse)
def create_booking(payload: BookingCreate, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not public_submission_rate_limiter.is_allowed(f"booking:{client_ip}"):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many booking submissions. Please wait a moment before trying again."
        )

    try:
        booking_id = storage_service.create_booking(payload.model_dump())
        return BookingResponse(
            success=True,
            message="Booking enquiry received! Arjun Sharma Studio will contact you within 24 hours to finalize details.",
            booking_id=booking_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record booking: {str(e)}")

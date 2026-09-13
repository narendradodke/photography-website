from fastapi import APIRouter, HTTPException
from app.models.booking import BookingCreate, BookingResponse
from app.services.storage_service import storage_service

router = APIRouter()

@router.post("/booking", response_model=BookingResponse)
def create_booking(payload: BookingCreate):
    try:
        booking_id = storage_service.create_booking(payload.model_dump())
        return BookingResponse(
            success=True,
            message="Booking enquiry received! Arjun Sharma Studio will contact you within 24 hours to finalize details.",
            booking_id=booking_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

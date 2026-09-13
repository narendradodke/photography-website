from fastapi import APIRouter, HTTPException
from app.models.booking import ContactCreate, ContactResponse
from app.services.storage_service import storage_service

router = APIRouter()

@router.post("/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate):
    try:
        storage_service.create_contact(payload.model_dump())
        return ContactResponse(
            success=True,
            message="Thank you for your message. We look forward to connecting with you soon."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

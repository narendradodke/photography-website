from pydantic import BaseModel, Field
from typing import Optional

class BookingCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    package_tier: str = Field(...)
    event_date: str = Field(...)
    message: Optional[str] = None

class BookingResponse(BaseModel):
    success: bool
    message: str
    booking_id: str

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(...)
    message: str = Field(..., min_length=5, max_length=2000)

class ContactResponse(BaseModel):
    success: bool
    message: str

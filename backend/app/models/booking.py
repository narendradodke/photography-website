from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class BookingCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=25)
    package_tier: str = Field(..., min_length=2, max_length=50)
    event_date: str = Field(..., min_length=4, max_length=50)
    message: Optional[str] = Field(None, max_length=1500)

    @field_validator("full_name", "phone", "package_tier", "event_date")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            cleaned = v.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or only spaces")
            return cleaned
        return v

class BookingResponse(BaseModel):
    success: bool
    message: str
    booking_id: str

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=5, max_length=2000)

    @field_validator("name", "message")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            cleaned = v.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or only spaces")
            return cleaned
        return v

class ContactResponse(BaseModel):
    success: bool
    message: str

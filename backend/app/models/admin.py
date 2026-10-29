from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=4)

class AdminOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    full_name: str
    is_active: bool
    created_at: str
    last_login: Optional[str] = None

class LoginResponse(BaseModel):
    token: str
    token_type: str = "Bearer"
    admin: AdminOut

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, description="Minimum 8 characters")

class AdminCreateRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field("editor", pattern="^(superadmin|editor)$")
    full_name: str = Field("", max_length=100)

class AdminUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = Field(None, pattern="^(superadmin|editor)$")
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

# --- Content Schemas ---

class PortfolioCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=50)
    image: str = Field(..., min_length=1)
    thumbnail: Optional[str] = None
    location: str = Field("Indore", max_length=100)
    date: str = Field("2025", max_length=50)
    aspect: str = Field("vertical", pattern="^(vertical|horizontal|square)$")
    tags: Optional[str] = ""
    alt_text: Optional[str] = ""
    is_featured: Optional[bool] = False
    order_index: Optional[int] = 0

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    thumbnail: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    aspect: Optional[str] = None
    tags: Optional[str] = None
    alt_text: Optional[str] = None
    is_featured: Optional[bool] = None
    order_index: Optional[int] = None

class PortfolioReorderRequest(BaseModel):
    ordered_ids: List[str]

class AlbumCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    subtitle: Optional[str] = ""
    photos_count: int = Field(0, ge=0)
    badge_or_tag: Optional[str] = "Album Spread"
    cover: str = Field(..., min_length=1)
    preview_images: Optional[List[str]] = []
    is_featured: Optional[bool] = False
    is_visible: Optional[bool] = True
    order_index: Optional[int] = 0

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    photos_count: Optional[int] = None
    badge_or_tag: Optional[str] = None
    cover: Optional[str] = None
    preview_images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None
    order_index: Optional[int] = None

class ReelCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    category: str = Field("Weddings", max_length=50)
    shortcode: Optional[str] = ""
    url: Optional[str] = ""
    embed_url: Optional[str] = ""
    video_url: Optional[str] = ""
    cover: Optional[str] = ""
    duration: Optional[str] = "0:45"
    is_visible: Optional[bool] = True
    order_index: Optional[int] = 0

class ReelUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    shortcode: Optional[str] = None
    url: Optional[str] = None
    embed_url: Optional[str] = None
    video_url: Optional[str] = None
    cover: Optional[str] = None
    duration: Optional[str] = None
    is_visible: Optional[bool] = None
    order_index: Optional[int] = None

class PackageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    tagline: str = Field(..., min_length=2, max_length=200)
    price: str = Field(..., min_length=2, max_length=50)
    price_num: int = Field(..., ge=0)
    popular: Optional[bool] = False
    features: List[str] = Field(..., min_length=1)
    is_active: Optional[bool] = True
    order_index: Optional[int] = 0

class PackageUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    price: Optional[str] = None
    price_num: Optional[int] = None
    popular: Optional[bool] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class TestimonialCreate(BaseModel):
    __test__ = False
    name: str = Field(..., min_length=2, max_length=100)
    event: str = Field(..., min_length=2, max_length=100)
    rating: int = Field(5, ge=1, le=5)
    quote: str = Field(..., min_length=5, max_length=1000)
    avatar: str = Field(..., min_length=1)
    is_approved: Optional[bool] = True
    order_index: Optional[int] = 0

class TestimonialUpdate(BaseModel):
    __test__ = False
    name: Optional[str] = None
    event: Optional[str] = None
    rating: Optional[int] = None
    quote: Optional[str] = None
    avatar: Optional[str] = None
    is_approved: Optional[bool] = None
    order_index: Optional[int] = None

class BookingStatusUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|completed|cancelled)$")
    internal_notes: Optional[str] = None
    event_date: Optional[str] = None
    package_tier: Optional[str] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None

class ContactStatusUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(new|read|replied)$")
    is_read: Optional[bool] = None
    internal_notes: Optional[str] = None

class SettingsUpdateRequest(BaseModel):
    category: str
    settings: dict

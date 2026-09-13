from fastapi import APIRouter, Query
from typing import Optional
from app.services.storage_service import storage_service

router = APIRouter()

@router.get("/portfolio")
def get_portfolio(category: Optional[str] = Query(None)):
    return storage_service.get_portfolio(category)

@router.get("/albums")
def get_albums():
    return storage_service.get_albums()

@router.get("/reels")
def get_reels():
    return storage_service.get_reels()

@router.get("/packages")
def get_packages():
    return storage_service.get_packages()

@router.get("/testimonials")
def get_testimonials():
    return storage_service.get_testimonials()

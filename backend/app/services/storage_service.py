from typing import Any, Dict, List, Optional
from app.db import repository

class StorageService:
    """Persistent SQLite-backed Storage Service replacing legacy in-memory lists."""

    def get_portfolio(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        items, _ = repository.get_portfolio(category=category)
        return items

    def get_albums(self) -> Dict[str, Any]:
        return repository.get_albums_public()

    def get_reels(self) -> List[Dict[str, Any]]:
        raw_reels = repository.get_reels(only_visible=True)
        reels = []
        for r in raw_reels:
            item = dict(r)
            item["videoUrl"] = r.get("video_url") or ""
            item["embedUrl"] = r.get("embed_url") or ""
            item["cover"] = r.get("cover") or ""
            reels.append(item)
        return reels

    def get_packages(self) -> List[Dict[str, Any]]:
        return repository.get_packages(only_active=True)

    def get_testimonials(self) -> List[Dict[str, Any]]:
        return repository.get_testimonials(only_approved=True)

    def create_booking(self, data: Dict[str, Any]) -> str:
        return repository.create_booking(data)

    def create_contact(self, data: Dict[str, Any]) -> int:
        return repository.create_contact(data)

storage_service = StorageService()

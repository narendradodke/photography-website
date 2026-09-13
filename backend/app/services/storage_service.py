import json
import os
import uuid
from typing import Any, Dict, List, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def read_json_file(filename: str) -> Any:
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

class StorageService:
    def __init__(self):
        self.bookings: List[Dict[str, Any]] = []
        self.contacts: List[Dict[str, Any]] = []

    def get_portfolio(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        items = read_json_file("portfolio.json")
        if category and category.lower() != "all":
            return [it for it in items if it.get("category", "").lower() == category.lower()]
        return items

    def get_albums(self) -> Dict[str, Any]:
        return read_json_file("albums.json")

    def get_reels(self) -> List[Dict[str, Any]]:
        return read_json_file("reels.json")

    def get_packages(self) -> List[Dict[str, Any]]:
        return read_json_file("packages.json")

    def get_testimonials(self) -> List[Dict[str, Any]]:
        return read_json_file("testimonials.json")

    def create_booking(self, data: Dict[str, Any]) -> str:
        booking_id = f"BK-{uuid.uuid4().hex[:6].upper()}"
        record = {
            "booking_id": booking_id,
            **data
        }
        self.bookings.append(record)
        return booking_id

    def create_contact(self, data: Dict[str, Any]) -> bool:
        self.contacts.append(data)
        return True

storage_service = StorageService()

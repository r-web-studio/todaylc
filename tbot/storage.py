import json
import os
from datetime import datetime
from typing import Optional

_DATA_DIR = os.getenv("STORAGE_DIR", os.path.dirname(os.path.abspath(__file__)))
STORAGE_FILE = os.path.join(_DATA_DIR, "enrollments.json")


def _load() -> list[dict]:
    if not os.path.exists(STORAGE_FILE):
        return []
    with open(STORAGE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: list[dict]):
    os.makedirs(os.path.dirname(STORAGE_FILE), exist_ok=True)
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def save_enrollment(name: str, phone: str, course: str, course_label: str) -> dict:
    record = {
        "id": int(datetime.now().timestamp() * 1000),
        "name": name,
        "phone": phone,
        "course": course,
        "course_label": course_label,
        "created_at": datetime.now().isoformat(),
    }
    data = _load()
    data.append(record)
    _save(data)
    return record


def get_enrollments(limit: int = 50) -> list[dict]:
    data = _load()
    data.sort(key=lambda r: r.get("created_at", ""), reverse=True)
    return data[:limit]


def get_enrollment_by_id(enrollment_id: int) -> Optional[dict]:
    data = _load()
    for r in data:
        if r["id"] == enrollment_id:
            return r
    return None


def delete_enrollment_by_id(enrollment_id: int) -> bool:
    data = _load()
    new_data = [r for r in data if r["id"] != enrollment_id]
    if len(new_data) == len(data):
        return False
    _save(new_data)
    return True

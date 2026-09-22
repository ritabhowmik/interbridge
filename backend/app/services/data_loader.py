"""Loads curated regulation seed data from disk. No live scraping, no DB."""
import json
from functools import lru_cache
from pathlib import Path

from app.models.schema import ProvinceCategoryFile

SEED_DIR = Path(__file__).resolve().parent.parent / "data" / "seed"

PROVINCES = [
    {"code": "ON", "name": "Ontario"},
    {"code": "QC", "name": "Quebec"},
    {"code": "BC", "name": "British Columbia"},
    {"code": "AB", "name": "Alberta"},
]

CATEGORIES = [
    {"code": "packaged_food", "label": "packaged food"},
    {"code": "alcohol", "label": "alcohol"},
    {"code": "cosmetics", "label": "cosmetics"},
]


@lru_cache(maxsize=1)
def load_all() -> dict[str, dict[str, ProvinceCategoryFile]]:
    """Returns {province_code: {category: ProvinceCategoryFile}}."""
    data: dict[str, dict[str, ProvinceCategoryFile]] = {}
    for province in PROVINCES:
        code = province["code"]
        province_dir = SEED_DIR / code.lower()
        data[code] = {}
        if not province_dir.exists():
            continue
        for category_file in province_dir.glob("*.json"):
            with open(category_file, encoding="utf-8") as f:
                raw = json.load(f)
            parsed = ProvinceCategoryFile.model_validate(raw)
            data[code][parsed.category] = parsed
    return data


def get_province_category(province_code: str, category: str) -> ProvinceCategoryFile | None:
    return load_all().get(province_code, {}).get(category)


def province_name(province_code: str) -> str:
    for p in PROVINCES:
        if p["code"] == province_code:
            return p["name"]
    return province_code

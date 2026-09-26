"""
Run this once to (re)initialize the DB and load seed regulation data.

    python seed_db.py
"""
import json
import os
from database import Base, engine, SessionLocal
from models import Regulation

SEED_FILES = [
    "seed_data/on_regulations.json",
    "seed_data/qc_regulations.json",
    "seed_data/bc_regulations.json",
    "seed_data/ab_regulations.json",
]


def main():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    count = 0
    for path in SEED_FILES:
        full_path = os.path.join(os.path.dirname(__file__), path)
        with open(full_path, "r") as f:
            rows = json.load(f)
        for row in rows:
            reg = Regulation(**row)
            db.add(reg)
            count += 1
    db.commit()
    db.close()
    print(f"Seeded {count} regulations across {len(SEED_FILES)} provinces.")


if __name__ == "__main__":
    main()

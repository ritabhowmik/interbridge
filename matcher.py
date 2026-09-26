from sqlalchemy.orm import Session
from models import Regulation


def get_candidate_regulations(db: Session, target_province: str, sector: str):
    """Deterministic SQL retrieval, no LLM involved. Keeps the candidate set auditable."""
    return (
        db.query(Regulation)
        .filter(Regulation.province == target_province, Regulation.sector == sector)
        .all()
    )

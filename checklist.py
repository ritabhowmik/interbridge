from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Analysis

router = APIRouter()


@router.get("/checklist/{analysis_id}")
def get_checklist(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {
        "analysis_id": analysis.id,
        "business_description": analysis.business_description,
        "origin_province": analysis.origin_province,
        "target_province": analysis.target_province,
        "sector_classified": analysis.sector_classified,
        **analysis.result_json,
    }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Analysis, Regulation
from schemas import AnalyzeRequest, AnalyzeResponse, BlockerItem, ChecklistItem
from services.classifier import classify_business
from services.matcher import get_candidate_regulations
from services.generator import generate_breakdown

router = APIRouter()

CONFIDENCE_FLOOR = 0.35  # below this, ask the user to clarify rather than guessing


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    classification = classify_business(payload.business_description)
    sector = classification.get("sector")
    confidence = classification.get("confidence", 0.0)

    if not sector or confidence < CONFIDENCE_FLOOR:
        # Graceful low-confidence path: still return a valid response shape,
        # but with no blockers and a message asking for more detail.
        empty = Analysis(
            business_description=payload.business_description,
            origin_province=payload.origin_province,
            target_province=payload.target_province,
            sector_classified=None,
            result_json={
                "blockers": [],
                "checklist": [],
                "clarification_needed": True,
            },
        )
        db.add(empty)
        db.commit()
        db.refresh(empty)
        return AnalyzeResponse(
            analysis_id=empty.id,
            sector_classified=None,
            target_province=payload.target_province,
            blockers=[],
            checklist=[],
            disclaimer=(
                "Couldn't confidently classify this business. Try adding more detail "
                "about what's being sold or produced."
            ),
        )

    candidates = get_candidate_regulations(db, payload.target_province, sector)
    generated = generate_breakdown(payload.business_description, candidates)

    # Build a lookup so source_url/authority always come from our verified DB rows,
    # never from the model's own restatement of them.
    reg_by_id = {r.id: r for r in candidates}

    blockers = []
    for item in generated.get("blockers", []):
        reg = reg_by_id.get(item.get("regulation_id"))
        if not reg:
            continue  # drop anything not in our verified candidate set
        blockers.append(
            BlockerItem(
                regulation_id=reg.id,
                title=item.get("title", reg.title),
                plain_language_explanation=item.get(
                    "plain_language_explanation", reg.plain_language_summary
                ),
                severity=item.get("severity", reg.severity),
                confidence=item.get("confidence", "medium"),
                source_url=reg.source_url,
                authority=reg.authority,
            )
        )

    checklist = []
    for item in generated.get("checklist", []):
        if item.get("regulation_id") in reg_by_id:
            checklist.append(
                ChecklistItem(
                    regulation_id=item["regulation_id"],
                    action_item=item.get("action_item", ""),
                )
            )

    result_payload = {
        "sector_classified": sector,
        "blockers": [b.model_dump() for b in blockers],
        "checklist": [c.model_dump() for c in checklist],
    }

    analysis = Analysis(
        business_description=payload.business_description,
        origin_province=payload.origin_province,
        target_province=payload.target_province,
        sector_classified=sector,
        result_json=result_payload,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalyzeResponse(
        analysis_id=analysis.id,
        sector_classified=sector,
        target_province=payload.target_province,
        blockers=blockers,
        checklist=checklist,
    )

from fastapi import APIRouter, HTTPException

from app.models.schema import CheckRequest, CheckResponse
from app.services.data_loader import CATEGORIES, PROVINCES
from app.services.matcher import build_province_result, match_category

router = APIRouter(prefix="/api")


@router.get("/provinces")
def list_provinces():
    return PROVINCES


@router.get("/categories")
def list_categories():
    return CATEGORIES


@router.post("/check", response_model=CheckResponse)
def check(request: CheckRequest) -> CheckResponse:
    category = match_category(request.business_description)
    if category is None:
        raise HTTPException(
            status_code=422,
            detail="couldn't match this business description to a covered category "
            "(packaged food, alcohol, cosmetics). try describing the product more specifically.",
        )

    results = []
    for province_code in request.provinces:
        result = build_province_result(
            business_description=request.business_description,
            province_code=province_code,
            category=category,
            daily_revenue=request.daily_revenue,
        )
        if result is not None:
            results.append(result)

    return CheckResponse(
        business_description=request.business_description,
        matched_category=category,
        results=results,
    )

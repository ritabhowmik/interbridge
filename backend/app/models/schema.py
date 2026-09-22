"""Pydantic models for seed regulation data and API request/response shapes."""
from typing import Literal, Optional

from pydantic import BaseModel, Field

ProvinceCode = Literal["ON", "QC", "BC", "AB"]
Category = Literal["packaged_food", "alcohol", "cosmetics"]
RequirementType = Literal[
    "labelling", "licensing", "permit", "certification", "inspection", "tax", "registration"
]
Severity = Literal["blocking", "advisory"]


class RegulationEntry(BaseModel):
    id: str
    title: str
    summary: str
    regulation_name: str
    authority: str
    trigger_keywords: list[str]
    requirement_type: RequirementType
    severity: Severity
    action_required: str
    estimated_timeline_days: int = Field(description="typical time to comply/get approval, in days")
    penalty_note: str
    source_name: str
    source_url: str
    last_verified: str


class ProvinceCategoryFile(BaseModel):
    province_code: ProvinceCode
    province_name: str
    category: Category
    category_label: str
    regulations: list[RegulationEntry]


# ---- API request/response models ----

class CheckRequest(BaseModel):
    business_description: str = Field(description="what the business sells, free text")
    provinces: list[ProvinceCode]
    daily_revenue: Optional[float] = Field(
        default=None, description="optional, for cost-of-delay estimate"
    )


class ChecklistItem(BaseModel):
    label: str
    source_citation: str
    checked: bool = False


class ProvinceResult(BaseModel):
    province_code: ProvinceCode
    province_name: str
    status: Literal["blocked", "clear"]
    blocked: list[RegulationEntry]
    explanation: str
    checklist: list[ChecklistItem]
    estimated_delay_days: int
    cost_of_delay: Optional[float] = None


class CheckResponse(BaseModel):
    business_description: str
    matched_category: Optional[Category]
    results: list[ProvinceResult]

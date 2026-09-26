from typing import List, Optional, Literal
from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    business_description: str
    origin_province: str
    target_province: str


class BlockerItem(BaseModel):
    regulation_id: str
    title: str
    plain_language_explanation: str
    severity: Literal["blocker", "conditional", "informational"]
    confidence: Literal["high", "medium", "low"]
    source_url: str
    authority: str


class ChecklistItem(BaseModel):
    regulation_id: str
    action_item: str
    done: bool = False


class AnalyzeResponse(BaseModel):
    analysis_id: str
    sector_classified: Optional[str]
    target_province: str
    blockers: List[BlockerItem]
    checklist: List[ChecklistItem]
    disclaimer: str = (
        "This is a first-pass triage tool, not legal advice. "
        "Confirm with the listed authority before acting."
    )


class ClarifyResponse(BaseModel):
    needs_clarification: bool = True
    message: str

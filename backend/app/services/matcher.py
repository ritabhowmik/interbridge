"""Category matching (keyword heuristic) + Claude-powered explain/checklist generation.

The AI's job is matching-within-a-category and explaining/formatting, never discovering
regulations: it only ever sees the curated seed entries for the matched province+category
and is instructed to select from and cite only those. If the API call fails or returns
something we can't parse, we fall back to a deterministic explanation built directly from
the seed data, so the demo never breaks.
"""
import json
import os
import re
from typing import Optional

from app.models.schema import Category, ChecklistItem, ProvinceCategoryFile, ProvinceResult, RegulationEntry
from app.services.data_loader import CATEGORIES, get_province_category, load_all, province_name

_ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929"


def _category_keyword_index() -> dict[str, set[str]]:
    """category -> set of lowercase trigger keywords, aggregated across all provinces."""
    index: dict[str, set[str]] = {c["code"]: set() for c in CATEGORIES}
    for province_data in load_all().values():
        for category, file in province_data.items():
            for entry in file.regulations:
                index[category].update(k.lower() for k in entry.trigger_keywords)
    return index


def match_category(business_description: str) -> Optional[Category]:
    """Simple keyword-overlap heuristic. No live discovery, just picks among the 3 curated categories."""
    text = business_description.lower()
    index = _category_keyword_index()
    best_category: Optional[str] = None
    best_score = 0
    for category, keywords in index.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > best_score:
            best_score = score
            best_category = category
    if best_score == 0:
        return None
    return best_category  # type: ignore[return-value]


def _deterministic_result(business_description: str, file: ProvinceCategoryFile) -> dict:
    """Fallback used when the Claude API is unavailable or returns something unparseable."""
    blocked = [e for e in file.regulations if e.severity == "blocking"]
    if not blocked:
        return {
            "blocked_ids": [],
            "explanation": (
                f"no blocking {file.category_label} regulations found for {file.province_name} "
                f"in our curated dataset for this business description."
            ),
        }
    lines = [f"{e.title.lower()} ({e.authority.lower()})" for e in blocked]
    explanation = (
        f"selling {file.category_label} in {file.province_name} triggers {len(blocked)} "
        f"provincial requirement(s): " + "; ".join(lines) + "."
    )
    return {"blocked_ids": [e.id for e in blocked], "explanation": explanation}


def _build_prompt(business_description: str, file: ProvinceCategoryFile) -> str:
    entries_json = json.dumps([e.model_dump() for e in file.regulations], indent=2)
    return f"""you are helping a small business understand which provincial regulations apply to them. you are given the business's own description of what it sells, and the FULL list of curated, pre-verified regulations for {file.province_name} in the "{file.category_label}" category. this is the complete and only source of truth — do not invent, assume, or reference any regulation not in this list, and do not reference any other province.

business description: "{business_description}"

candidate regulations for {file.province_name} ({file.category_label}):
{entries_json}

decide which of these regulations apply to this specific business (usually most or all "blocking" ones apply, but use judgment based on the description — e.g. skip an alcohol-specific entry if the business description is clearly not about alcohol production/sale within this category).

respond with ONLY a JSON object, no markdown fences, no commentary, in this exact shape:
{{
  "blocked_ids": ["<id of each regulation from the list that applies>"],
  "explanation": "<2-4 sentence plain-language explanation, lowercase, written for a business owner, summarizing why this province is blocked or clear for this business>"
}}
"""


def _call_claude(business_description: str, file: ProvinceCategoryFile) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _deterministic_result(business_description, file)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=_ANTHROPIC_MODEL,
            max_tokens=1024,
            messages=[{"role": "user", "content": _build_prompt(business_description, file)}],
        )
        raw_text = "".join(block.text for block in response.content if hasattr(block, "text"))
        match = re.search(r"\{.*\}", raw_text, re.DOTALL)
        if not match:
            return _deterministic_result(business_description, file)
        parsed = json.loads(match.group(0))
        valid_ids = {e.id for e in file.regulations}
        blocked_ids = [bid for bid in parsed.get("blocked_ids", []) if bid in valid_ids]
        explanation = parsed.get("explanation") or _deterministic_result(business_description, file)["explanation"]
        return {"blocked_ids": blocked_ids, "explanation": explanation}
    except Exception:
        return _deterministic_result(business_description, file)


def _build_checklist(blocked: list[RegulationEntry]) -> list[ChecklistItem]:
    return [
        ChecklistItem(
            label=entry.action_required,
            source_citation=f"{entry.regulation_name} — {entry.source_name}",
        )
        for entry in blocked
    ]


def build_province_result(
    business_description: str,
    province_code: str,
    category: Category,
    daily_revenue: Optional[float],
) -> Optional[ProvinceResult]:
    file = get_province_category(province_code, category)
    if file is None:
        return None

    ai_result = _call_claude(business_description, file)
    blocked_entries = [e for e in file.regulations if e.id in ai_result["blocked_ids"]]

    status = "blocked" if blocked_entries else "clear"
    estimated_delay_days = max((e.estimated_timeline_days for e in blocked_entries), default=0)
    cost_of_delay = (
        round(estimated_delay_days * daily_revenue, 2)
        if daily_revenue is not None and estimated_delay_days > 0
        else None
    )

    return ProvinceResult(
        province_code=province_code,  # type: ignore[arg-type]
        province_name=province_name(province_code),
        status=status,
        blocked=blocked_entries,
        explanation=ai_result["explanation"],
        checklist=_build_checklist(blocked_entries),
        estimated_delay_days=estimated_delay_days,
        cost_of_delay=cost_of_delay,
    )

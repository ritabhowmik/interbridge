import json
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SECTOR_TAXONOMY = [
    "alcohol_production",
    "food_processing",
    "trucking_logistics",
    "professional_services",
]

SYSTEM_PROMPT = f"""You classify a business description into exactly one sector from this fixed list:
{json.dumps(SECTOR_TAXONOMY)}

Respond with ONLY a JSON object, no preamble, no markdown fences:
{{"sector": "<one of the list above, or null if none fit>", "confidence": <float 0.0-1.0>}}

If the business description is too vague or doesn't clearly fit any sector, set sector to null and confidence to a low value.
"""


def classify_business(business_description: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": business_description}],
    )
    text = "".join(
        block.text for block in response.content if block.type == "text"
    ).strip()
    text = text.replace("```json", "").replace("```", "").strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = {"sector": None, "confidence": 0.0}
    return parsed

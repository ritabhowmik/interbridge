const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BlockerItem {
  regulation_id: string;
  title: string;
  plain_language_explanation: string;
  severity: "blocker" | "conditional" | "informational";
  confidence: "high" | "medium" | "low";
  source_url: string;
  authority: string;
}

export interface ChecklistItem {
  regulation_id: string;
  action_item: string;
  done: boolean;
}

export interface AnalyzeResponse {
  analysis_id: string;
  sector_classified: string | null;
  target_province: string;
  blockers: BlockerItem[];
  checklist: ChecklistItem[];
  disclaimer: string;
}

export async function analyzeBusiness(payload: {
  business_description: string;
  origin_province: string;
  target_province: string;
}): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`analyze request failed: ${res.status}`);
  }
  return res.json();
}

export async function getChecklist(analysisId: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_URL}/checklist/${analysisId}`);
  if (!res.ok) {
    throw new Error(`checklist request failed: ${res.status}`);
  }
  return res.json();
}

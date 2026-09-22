export type ProvinceCode = "ON" | "QC" | "BC" | "AB";
export type Category = "packaged_food" | "alcohol" | "cosmetics";

export interface RegulationEntry {
  id: string;
  title: string;
  summary: string;
  regulation_name: string;
  authority: string;
  trigger_keywords: string[];
  requirement_type: string;
  severity: "blocking" | "advisory";
  action_required: string;
  estimated_timeline_days: number;
  penalty_note: string;
  source_name: string;
  source_url: string;
  last_verified: string;
}

export interface ChecklistItem {
  label: string;
  source_citation: string;
  checked: boolean;
}

export interface ProvinceResult {
  province_code: ProvinceCode;
  province_name: string;
  status: "blocked" | "clear";
  blocked: RegulationEntry[];
  explanation: string;
  checklist: ChecklistItem[];
  estimated_delay_days: number;
  cost_of_delay: number | null;
}

export interface CheckResponse {
  business_description: string;
  matched_category: Category | null;
  results: ProvinceResult[];
}

export interface ProvinceOption {
  code: ProvinceCode;
  name: string;
}

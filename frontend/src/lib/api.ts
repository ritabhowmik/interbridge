import type { CheckResponse, ProvinceCode, ProvinceOption } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export async function fetchProvinces(): Promise<ProvinceOption[]> {
  const res = await fetch(`${API_BASE}/api/provinces`);
  if (!res.ok) throw new Error("failed to load provinces");
  return res.json();
}

export async function checkExpansion(
  businessDescription: string,
  provinces: ProvinceCode[],
  dailyRevenue: number | null
): Promise<CheckResponse> {
  const res = await fetch(`${API_BASE}/api/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      business_description: businessDescription,
      provinces,
      daily_revenue: dailyRevenue,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "something went wrong checking your expansion");
  }
  return res.json();
}

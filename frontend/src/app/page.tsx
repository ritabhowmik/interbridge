"use client";

import { useState } from "react";
import LandingForm from "@/components/LandingForm";
import ResultsView from "@/components/ResultsView";
import ChecklistView from "@/components/ChecklistView";
import { checkExpansion } from "@/lib/api";
import type { CheckResponse, ProvinceCode } from "@/lib/types";

type Step = "landing" | "results" | "checklist";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [data, setData] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    description: string,
    provinces: ProvinceCode[],
    dailyRevenue: number | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await checkExpansion(description, provinces, dailyRevenue);
      setData(result);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setData(null);
    setError(null);
    setStep("landing");
  };

  if (step === "results" && data) {
    return (
      <ResultsView
        data={data}
        onViewChecklist={() => setStep("checklist")}
        onRestart={restart}
      />
    );
  }

  if (step === "checklist" && data) {
    return (
      <ChecklistView data={data} onBack={() => setStep("results")} onRestart={restart} />
    );
  }

  return <LandingForm onSubmit={handleSubmit} loading={loading} error={error} />;
}

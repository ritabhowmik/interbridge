"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RegulationCard from "../../../components/RegulationCard";
import ChecklistItem from "../../../components/ChecklistItem";
import { getChecklist, type AnalyzeResponse } from "../../../lib/api";

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChecklist(params.id)
      .then(setData)
      .catch(() => setError("couldn't load this analysis"));
  }, [params.id]);

  if (error) {
    return (
      <main className="text-center space-y-4">
        <p className="text-blocker">{error}</p>
        <Link href="/" className="underline text-white/60">
          start over
        </Link>
      </main>
    );
  }

  if (!data) {
    return <p className="text-center text-white/50">loading...</p>;
  }

  return (
    <main className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl gradient-text">
          your breakdown for {data.target_province}
        </h1>
        {data.sector_classified && (
          <p className="text-white/50 text-sm">
            classified as: {data.sector_classified.replace(/_/g, " ")}
          </p>
        )}
      </div>

      {data.blockers.length === 0 ? (
        <div className="glass-card p-6 text-center text-white/60">
          no blockers found for the details you gave, or we need more detail
          to classify this business correctly
        </div>
      ) : (
        <div className="space-y-4">
          {data.blockers.map((b) => (
            <RegulationCard key={b.regulation_id} item={b} />
          ))}
        </div>
      )}

      {data.checklist.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl">checklist</h2>
          {data.checklist.map((c, i) => (
            <ChecklistItem key={`${c.regulation_id}-${i}`} item={c} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-white/30 pt-4">
        {data.disclaimer}
      </p>

      <div className="text-center">
        <Link href="/" className="underline text-white/50 text-sm">
          check another expansion
        </Link>
      </div>
    </main>
  );
}

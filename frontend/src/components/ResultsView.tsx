"use client";

import Badge from "./Badge";
import Disclaimer from "./Disclaimer";
import type { CheckResponse } from "@/lib/types";

interface Props {
  data: CheckResponse;
  onViewChecklist: () => void;
  onRestart: () => void;
}

export default function ResultsView({ data, onViewChecklist, onRestart }: Props) {
  const anyBlocked = data.results.some((r) => r.status === "blocked");

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <button onClick={onRestart} className="lowercase-copy text-sm text-[var(--text-muted)] hover:text-white">
        ← start over
      </button>

      <h1 className="lowercase-copy mt-6 text-4xl font-medium">
        results for <span className="gradient-text">{data.matched_category?.replace("_", " ")}</span>
      </h1>
      <p className="lowercase-copy mt-2 text-[var(--text-muted)]">&ldquo;{data.business_description}&rdquo;</p>

      <div className="mt-10 space-y-6">
        {data.results.map((result) => (
          <div key={result.province_code} className="glass-card p-7">
            <div className="flex items-center justify-between">
              <h2 className="lowercase-copy text-2xl font-medium">{result.province_name}</h2>
              <Badge status={result.status} />
            </div>

            <p className="mt-4 text-[var(--text-muted)] lowercase-copy">{result.explanation}</p>

            {result.status === "blocked" && (
              <div className="mt-5 space-y-3">
                {result.blocked.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <p className="font-medium">{entry.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{entry.summary}</p>
                  </div>
                ))}
              </div>
            )}

            {result.status === "blocked" && result.cost_of_delay != null && (
              <p className="lowercase-copy mt-5 text-sm">
                estimated cost of delay:{" "}
                <span className="gradient-text font-semibold">
                  ${result.cost_of_delay.toLocaleString()}
                </span>{" "}
                (~{result.estimated_delay_days} days blocked)
              </p>
            )}
          </div>
        ))}
      </div>

      {anyBlocked && (
        <button onClick={onViewChecklist} className="gradient-pill lowercase-copy mt-10 w-full py-4 text-lg font-medium">
          view compliance checklist
        </button>
      )}
      <Disclaimer />
    </div>
  );
}

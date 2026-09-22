"use client";

import { useState } from "react";
import type { CheckResponse } from "@/lib/types";
import Disclaimer from "./Disclaimer";

interface Props {
  data: CheckResponse;
  onBack: () => void;
  onRestart: () => void;
}

export default function ChecklistView({ data, onBack, onRestart }: Props) {
  const blockedResults = data.results.filter((r) => r.status === "blocked");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = blockedResults.reduce((sum, r) => sum + r.checklist.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <button onClick={onBack} className="lowercase-copy text-sm text-[var(--text-muted)] hover:text-white">
        ← back to results
      </button>

      <h1 className="lowercase-copy mt-6 text-4xl font-medium">
        your <span className="gradient-text">compliance checklist</span>
      </h1>
      <p className="lowercase-copy mt-2 text-[var(--text-muted)]">
        {doneItems} of {totalItems} steps done
      </p>

      <div className="mt-10 space-y-8">
        {blockedResults.map((result) => (
          <div key={result.province_code} className="glass-card p-7">
            <h2 className="lowercase-copy text-2xl font-medium">{result.province_name}</h2>
            <div className="mt-4 space-y-3">
              {result.checklist.map((item, idx) => {
                const key = `${result.province_code}-${idx}`;
                return (
                  <label
                    key={key}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggle(key)}
                      className="mt-1 h-4 w-4 accent-[var(--purple)]"
                    />
                    <span>
                      <span className={checked[key] ? "line-through text-[var(--text-muted)]" : ""}>
                        {item.label}
                      </span>
                      <span className="block text-xs text-[var(--text-muted)] mt-1">
                        source: {item.source_citation}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="gradient-pill lowercase-copy mt-10 w-full py-4 text-lg font-medium">
        check another expansion
      </button>
      <Disclaimer />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { BlockerItem } from "../lib/api";

const SEVERITY_LABEL: Record<BlockerItem["severity"], string> = {
  blocker: "blocker",
  conditional: "conditional",
  informational: "informational",
};

const SEVERITY_COLOR: Record<BlockerItem["severity"], string> = {
  blocker: "bg-blocker/20 text-blocker border-blocker/40",
  conditional: "bg-conditional/20 text-conditional border-conditional/40",
  informational: "bg-informational/20 text-informational border-informational/40",
};

export default function RegulationCard({ item }: { item: BlockerItem }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="glass-card p-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <span className="font-display text-lg">{item.title}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${SEVERITY_COLOR[item.severity]}`}
        >
          {SEVERITY_LABEL[item.severity]}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2 text-sm text-white/70">
          <p>{item.plain_language_explanation}</p>
          {item.confidence === "low" && (
            <p className="text-conditional text-xs">
              this one's ambiguous, worth confirming directly with {item.authority}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-white/40 pt-2">
            <span>{item.authority}</span>
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              view source
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const STATUS_LINES = [
  "checking the rules for your target province",
  "cross-referencing regulation sources",
  "sorting what applies from what doesn't",
  "putting together your checklist",
];

export default function LoadingScanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-8 text-center">
      <p className="text-white/60 font-display text-lg transition-opacity duration-500">
        {STATUS_LINES[index]}
      </p>
    </div>
  );
}

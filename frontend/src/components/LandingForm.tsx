"use client";

import { useState } from "react";
import type { ProvinceCode } from "@/lib/types";
import Disclaimer from "./Disclaimer";

const PROVINCES: { code: ProvinceCode; name: string }[] = [
  { code: "ON", name: "ontario" },
  { code: "QC", name: "quebec" },
  { code: "BC", name: "british columbia" },
  { code: "AB", name: "alberta" },
];

interface Props {
  onSubmit: (description: string, provinces: ProvinceCode[], dailyRevenue: number | null) => void;
  loading: boolean;
  error: string | null;
}

export default function LandingForm({ onSubmit, loading, error }: Props) {
  const [description, setDescription] = useState(
    "we make packaged artisan bakery goods like bread and pastries"
  );
  const [selected, setSelected] = useState<ProvinceCode[]>(["QC"]);
  const [dailyRevenue, setDailyRevenue] = useState("");

  const toggleProvince = (code: ProvinceCode) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || selected.length === 0) return;
    const revenue = dailyRevenue.trim() ? Number(dailyRevenue) : null;
    onSubmit(description.trim(), selected, revenue);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="lowercase-copy text-5xl sm:text-6xl font-medium leading-tight">
        which provinces{" "}
        <span className="gradient-text">block</span> your expansion?
      </h1>
      <p className="lowercase-copy mt-5 text-lg text-[var(--text-muted)]">
        tell us what you sell and where you&apos;re expanding. we&apos;ll tell you which
        provincial regulations stand in your way, and what to do about it.
      </p>

      <form onSubmit={handleSubmit} className="glass-card mt-12 p-8 text-left">
        <label className="lowercase-copy block text-sm text-[var(--text-muted)]">
          what do you sell?
        </label>
        <textarea
          className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 p-4 text-lg focus:outline-none focus:border-[var(--purple)]"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. packaged artisan bakery goods, craft beer, natural skincare products..."
        />

        <label className="lowercase-copy mt-6 block text-sm text-[var(--text-muted)]">
          where are you expanding?
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROVINCES.map((p) => (
            <button
              type="button"
              key={p.code}
              data-active={selected.includes(p.code)}
              onClick={() => toggleProvince(p.code)}
              className="pill-outline lowercase-copy px-5 py-2 text-base"
            >
              {p.name}
            </button>
          ))}
        </div>

        <label className="lowercase-copy mt-6 block text-sm text-[var(--text-muted)]">
          average daily revenue (optional, for a cost-of-delay estimate)
        </label>
        <input
          type="number"
          min={0}
          className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 p-4 text-lg focus:outline-none focus:border-[var(--purple)]"
          value={dailyRevenue}
          onChange={(e) => setDailyRevenue(e.target.value)}
          placeholder="$ 500"
        />

        {error && (
          <p className="lowercase-copy mt-4 text-sm text-[var(--blocked-text)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !description.trim() || selected.length === 0}
          className="gradient-pill lowercase-copy mt-8 w-full py-4 text-lg font-medium"
        >
          {loading ? "checking..." : "check my expansion"}
        </button>
      </form>

      <Disclaimer />
    </div>
  );
}

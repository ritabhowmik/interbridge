"use client";

import { useState } from "react";

const PROVINCES = ["ON", "QC", "BC", "AB"];

export default function IntakeForm({
  onSubmit,
}: {
  onSubmit: (data: {
    business_description: string;
    origin_province: string;
    target_province: string;
  }) => void;
}) {
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("ON");
  const [target, setTarget] = useState("BC");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      business_description: description,
      origin_province: origin,
      target_province: target,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
      <div>
        <label className="block text-sm text-white/70 mb-2">
          what does your business sell or do?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. we produce craft cider in prince edward county"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accentTo"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-white/70 mb-2">
            currently operating in
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-accentTo"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p} className="bg-base">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm text-white/70 mb-2">
            expanding into
          </label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-accentTo"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p} className="bg-base">
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-accentFrom to-accentTo text-black hover:opacity-90 transition-opacity"
      >
        check my regulations
      </button>
    </form>
  );
}

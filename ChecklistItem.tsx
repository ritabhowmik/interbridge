"use client";

import { useState } from "react";
import type { ChecklistItem as ChecklistItemType } from "../lib/api";

export default function ChecklistItem({ item }: { item: ChecklistItemType }) {
  const [done, setDone] = useState(item.done);

  return (
    <label className="flex items-start gap-3 glass-card p-4 cursor-pointer">
      <input
        type="checkbox"
        checked={done}
        onChange={() => setDone(!done)}
        className="mt-1 accent-accentTo"
      />
      <span className={done ? "line-through text-white/40" : "text-white/85"}>
        {item.action_item}
      </span>
    </label>
  );
}

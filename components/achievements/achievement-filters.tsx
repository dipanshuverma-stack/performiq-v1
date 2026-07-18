"use client";

import { AchievementCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
  value: AchievementCategory | "ALL";
  onChange: (value: AchievementCategory | "ALL") => void;
}

const filters: (AchievementCategory | "ALL")[] = [
  "ALL",
  "PLANNER",
  "PRACTICE",
  "MOCK",
  "REWARD",
  "STREAK",
  "SPECIAL",
];

export default function AchievementFilters({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
            value === filter
              ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
              : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
          )}
        >
          {filter === "ALL"
            ? "All"
            : filter.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
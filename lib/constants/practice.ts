export const DIFFICULTY_VALUES = ["EASY", "MEDIUM", "HARD"] as const;

export const REVISION_STATUS = {
  UNRESOLVED: "UNRESOLVED",
  IN_PROGRESS: "IN_PROGRESS",
  MASTERED: "MASTERED",
} as const;

// Derived array to keep Zod validations synced automatically
export const REVISION_STATUS_VALUES = Object.values(REVISION_STATUS);

export const CONFIDENCE_LEVELS = {
  1: { label: "Very Weak", color: "text-rose-600 bg-rose-50 border-rose-200" },
  2: { label: "Weak", color: "text-orange-600 bg-orange-50 border-orange-200" },
  3: { label: "Average", color: "text-amber-600 bg-amber-50 border-amber-200" },
  4: { label: "Good", color: "text-blue-600 bg-blue-50 border-blue-200" },
  5: { label: "Mastered", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
} as const;
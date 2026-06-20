import { PracticeDifficulty } from "@/lib/practice/types";

export const DEFAULT_DIFFICULTY: PracticeDifficulty = "MIXED";

export const PRACTICE_DIFFICULTY_LABELS: Record<PracticeDifficulty, string> = {
  EASY: "Easy",
  MIXED: "Mixed ⭐",
  MAINS: "Mains",
};

export const TARGET_PACE_MAP: Record<PracticeDifficulty, number> = {
  EASY: 2.2,
  MIXED: 1.8,
  MAINS: 1.1,
};
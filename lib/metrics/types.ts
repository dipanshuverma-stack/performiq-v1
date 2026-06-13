import { QuestionAttempt } from "@/components/practice/core/types";

// Re-export shared core domain dependencies cleanly
export type { QuestionAttempt };

/**
 * Technical Debt Note: Represents weight allocations (scores) per question state.
 * Refactor post-build to rename fields to { correct: number; wrong: number; }
 */
export interface MarkingScheme {
  correctQuestions: number;   // e.g., +1.0
  incorrectQuestions: number; // e.g., -0.25
}

export interface SessionMetrics {
  total: number;
  correctQuestions: number;
  incorrectQuestions: number;
  accuracy: number;
  pace: number;
  durationSeconds: number;
  avgTimeSeconds: number;
  currentStreak: number;
  bestStreak: number;
  obtainedMarks: number;
}

// Global default fallback config for uniform evaluation processing
export const DEFAULT_MARKING_SCHEME: MarkingScheme = {
  correctQuestions: 1,
  incorrectQuestions: -0.25,
};
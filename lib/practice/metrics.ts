import {
  QuestionAttempt,
  PracticePhase,
  SessionSnapshot,
} from "@/lib/practice/types";


export interface PracticeSessionMetrics {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  bestStreak: number; // Renamed explicitly to map clean domain properties
  pace: number;
  durationSeconds: number;
  averageTimeSeconds: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Derives comprehensive session performance indicators using a high-efficiency single pass.
 */
export const calculatePracticeMetrics = (
  attempts: QuestionAttempt[],
  elapsedMs: number
): PracticeSessionMetrics => {
  const total = attempts.length;

  let correct = 0;
  let currentStreak = 0;
  let bestStreak = 0;

  for (const attempt of attempts) {
    if (attempt.result === "correct") {
      correct++;
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  const wrong = total - correct;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
  const minutes = elapsedMs / 60000;
  const pace = minutes > 0 ? round2(total / minutes) : 0;

  return {
    total,
    correct,
    wrong,
    accuracy,
    bestStreak, // Symmetrical clean naming matching the contract interface
    pace,
    durationSeconds: Math.round(elapsedMs / 1000),
    averageTimeSeconds: total === 0 ? 0 : Math.round(elapsedMs / total / 1000),
  };
};
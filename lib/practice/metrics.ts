import {
  QuestionAttempt,
} from "@/lib/practice/types";

export interface PracticeSessionMetrics {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  bestStreak: number;
  pace: number;
  durationSeconds: number;
  averageTimeSeconds: number;
}

/**
 * Derives comprehensive session performance indicators using a single efficient pass.
 */
export const calculatePracticeMetrics = (
  attempts: QuestionAttempt[],
  elapsedMs: number
): PracticeSessionMetrics => {
  const total = attempts.length;

  if (total === 0) {
    return {
      total: 0,
      correct: 0,
      wrong: 0,
      accuracy: 0,
      bestStreak: 0,
      pace: 0,
      durationSeconds: Math.round(elapsedMs / 1000),
      averageTimeSeconds: 0,
    };
  }

  let correct = 0;
  let currentStreak = 0;
  let bestStreak = 0;

  for (const attempt of attempts) {
    if (attempt.result === "correct") {
      correct++;
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const wrong = total - correct;
  const accuracy = Math.round((correct / total) * 100);
  const minutes = elapsedMs / 60000;
  const pace = minutes > 0 ? Math.round((total / minutes) * 100) / 100 : 0;

  return {
    total,
    correct,
    wrong,
    accuracy,
    bestStreak,
    pace,
    durationSeconds: Math.round(elapsedMs / 1000),
    averageTimeSeconds: Math.round(elapsedMs / total / 1000),
  };
};
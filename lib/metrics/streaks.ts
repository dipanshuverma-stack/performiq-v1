import { QuestionAttempt } from "./types";

export function getCurrentStreak(
  attempts: QuestionAttempt[]
): number {
  let streak = 0;

  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].result === "correct") {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getBestStreak(
  attempts: QuestionAttempt[]
): number {
  let current = 0;
  let best = 0;

  for (const attempt of attempts) {
    if (attempt.result === "correct") {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}
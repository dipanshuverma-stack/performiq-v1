import { QuestionAttempt } from "@/components/practice/core/types";

export const calculateMetrics = (
  attempts: QuestionAttempt[],
  elapsedMs: number
) => {
  const total = attempts.length;

  const correct = attempts.filter(
    (a) => a.result === "correct"
  ).length;

  const wrong = total - correct;

  const accuracy =
    total > 0
      ? Math.round((correct / total) * 100)
      : 100;

  let streak = 0;

  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].result === "correct") {
      streak++;
    } else {
      break;
    }
  }

  const minutes = elapsedMs / 60000;

  const pace =
    minutes > 0
      ? Math.round(total / minutes)
      : 0;

  return {
    total,
    correct,
    wrong,
    accuracy,
    streak,
    pace,
    durationSeconds: Math.round(elapsedMs / 1000),
  };
};
import {
  QuestionAttempt,
  SessionMetrics,
  MarkingScheme,
  DEFAULT_MARKING_SCHEME,
} from "./types";

import {
  getCurrentStreak,
  getBestStreak,
} from "./streaks";

export function calculateSessionMetrics(
  attempts: QuestionAttempt[],
  elapsedMs: number,
  markingScheme: MarkingScheme = DEFAULT_MARKING_SCHEME
): SessionMetrics {
  let correctQuestions = 0;
  let incorrectQuestions = 0;

  for (const attempt of attempts) {
    if (attempt.result === "correct") {
      correctQuestions++;
    }

    if (attempt.result === "incorrectQuestions") {
      incorrectQuestions++;
    }
  }

  const total = attempts.length;

  const durationSeconds = Math.max(
    0,
    Math.round(elapsedMs / 1000)
  );

  const accuracy =
    total > 0
      ? Number(((correctQuestions / total) * 100).toFixed(2))
      : 0;

  const avgTimeSeconds =
    total > 0
      ? Number((durationSeconds / total).toFixed(2))
      : 0;

  const pace =
    durationSeconds > 0
      ? Number((total / (durationSeconds / 60)).toFixed(2))
      : 0;

  const obtainedMarks = Number(
    (
      correctQuestions * markingScheme.correctQuestions +
      incorrectQuestions * markingScheme.incorrectQuestions
    ).toFixed(2)
  );

  return {
    total,
    correctQuestions,
    incorrectQuestions,
    accuracy,
    pace,
    durationSeconds,
    avgTimeSeconds,
    currentStreak: getCurrentStreak(attempts),
    bestStreak: getBestStreak(attempts),
    obtainedMarks,
  };
}
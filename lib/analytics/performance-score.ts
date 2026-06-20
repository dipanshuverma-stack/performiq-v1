
import { getPracticeAnalytics } from "./practice-analytics";
import { getPracticeConsistency } from "./practice-consistency";

export interface PerformanceScore {
  score: number;
  accuracyScore: number;
  speedScore: number;
  consistencyScore: number;
}

export async function getPerformanceScore(
  userId: string
): Promise<PerformanceScore> {
  const [
    practice,
    consistency,
  ] = await Promise.all([
    getPracticeAnalytics(userId),
    getPracticeConsistency(userId),
  ]);

  const accuracyScore =
    practice.averageAccuracy;

  const speedScore =
    practice.speedScore;

  const consistencyScore =
    consistency.consistencyScore;

  const score = Math.round(
    accuracyScore * 0.45 +
      speedScore * 0.30 +
      consistencyScore * 0.25
  );

  return {
    score,

    accuracyScore,

    speedScore,

    consistencyScore,
  };
}

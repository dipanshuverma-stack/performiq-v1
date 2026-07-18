import { getPracticeAnalytics } from "./practice-analytics";
import { getPracticeConsistency } from "./practice-consistency";

export interface PerformanceScore {
  score: number;
  accuracyScore: number;
  speedScore: number;
  consistencyScore: number;
}

/**
 * Derives comprehensive user competency indicators by resolving practice metrics
 * and consistency metrics concurrently.
 */
export async function getPerformanceScore(userId: string): Promise<PerformanceScore> {
  const [practice, consistency] = await Promise.all([
    getPracticeAnalytics(userId),
    getPracticeConsistency(userId),
  ]);

  const accuracyScore = practice.averageAccuracy ?? 0;
  const speedScore = practice.speedScore ?? 0;
  const consistencyScore = consistency.consistencyScore ?? 0;

  // Weighted score formulation: 45% Accuracy, 30% Operational Speed, 25% Consistency
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
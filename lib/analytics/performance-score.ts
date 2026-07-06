import { cache } from "react";
import { getPracticeAnalytics } from "./practice-analytics";
import { getPracticeConsistency } from "./practice-consistency";

export interface PerformanceScore {
  score: number;
  accuracyScore: number;
  speedScore: number;
  consistencyScore: number;
}

const cachedPracticeAnalytics = cache((userId: string) => getPracticeAnalytics(userId));
const cachedPracticeConsistency = cache((userId: string) => getPracticeConsistency(userId));

export async function getPerformanceScore(userId: string): Promise<PerformanceScore> {
  const [practice, consistency] = await Promise.all([
    cachedPracticeAnalytics(userId),
    cachedPracticeConsistency(userId),
  ]);

  const accuracyScore = practice.averageAccuracy ?? 0;
  const speedScore = practice.speedScore ?? 0;
  const consistencyScore = consistency.consistencyScore ?? 0;

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
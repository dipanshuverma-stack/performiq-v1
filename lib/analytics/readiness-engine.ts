import { cache } from "react";
import { getReadinessCore } from "./readiness-core";
import { getPerformanceScore } from "./performance-score";

export const READINESS_WEIGHTS = {
  preparation: 0.8,
  performance: 0.2,
} as const;

export interface ReadinessEngine {
  readiness: number;
  preparationScore: number;
  performanceScore: number;
  completionScore: number;
  mockScore: number;
  revisionScore: number;
  unresolvedMistakes: number;
  accuracyScore: number;
  speedScore: number;
  consistencyScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
}

const cachedReadinessCore = cache((userId: string) => getReadinessCore(userId));
const cachedPerformanceScore = cache((userId: string) => getPerformanceScore(userId));

export async function getReadinessEngine(userId: string): Promise<ReadinessEngine> {
  const [preparation, performance] = await Promise.all([
    cachedReadinessCore(userId),
    cachedPerformanceScore(userId),
  ]);

  const readiness = Math.round(
    preparation.readiness * READINESS_WEIGHTS.preparation +
    performance.score * READINESS_WEIGHTS.performance
  );

  let grade: "S" | "A" | "B" | "C" | "D" = "D";
  if (readiness >= 95) grade = "S";
  else if (readiness >= 85) grade = "A";
  else if (readiness >= 75) grade = "B";
  else if (readiness >= 65) grade = "C";

  return {
    readiness,
    preparationScore: preparation.readiness,
    performanceScore: performance.score,
    completionScore: preparation.completionScore,
    mockScore: preparation.mockScore,
    revisionScore: preparation.revisionScore,
    unresolvedMistakes: preparation.unresolvedMistakes,
    accuracyScore: performance.accuracyScore,
    speedScore: performance.speedScore,
    consistencyScore: performance.consistencyScore,
    grade,
  };
}
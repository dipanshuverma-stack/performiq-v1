import { cache } from "react";
import { getReadinessCore } from "./readiness-core";
import { getPerformanceScore } from "./performance-score";

const cachedReadinessCore = cache((userId: string) => getReadinessCore(userId));
const cachedPerformanceScore = cache((userId: string) => getPerformanceScore(userId));

export async function getExamForecast(userId: string) {
  const [readiness, performance] = await Promise.all([
    cachedReadinessCore(userId),
    cachedPerformanceScore(userId),
  ]);

  const forecastScore = Math.round(
    readiness.readiness * 0.6 + performance.score * 0.4
  );

  let readinessLevel = "LOW";
  if (forecastScore >= 85) {
    readinessLevel = "HIGH";
  } else if (forecastScore >= 70) {
    readinessLevel = "MEDIUM";
  }

  return {
    forecastScore,
    readinessLevel,
  };
}
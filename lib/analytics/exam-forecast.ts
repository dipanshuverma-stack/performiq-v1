import { getReadinessCore } from "./readiness-core";
import { getPerformanceScore } from "./performance-score";

export async function getExamForecast(
  userId: string
) {
  const [
    readiness,
    performance,
  ] = await Promise.all([
    getReadinessCore(userId),
    getPerformanceScore(userId),
  ]);

  const forecastScore = Math.round(
    readiness.readiness * 0.6 +
    performance.score * 0.4
  );

  let readinessLevel =
    "LOW";

  if (forecastScore >= 85) {
    readinessLevel = "HIGH";
  } else if (
    forecastScore >= 70
  ) {
    readinessLevel =
      "MEDIUM";
  }

  return {
    forecastScore,
    readinessLevel,
  };
}
import { getReadinessScore } from "./readiness";
import { getPerformanceScore } from "./performance-score";

export async function getReadinessV2(
  userId: string
) {
  const [
    existingReadiness,
    performance,
  ] = await Promise.all([
    getReadinessScore(userId),
    getPerformanceScore(userId),
  ]);

  const readiness = Math.round(
    existingReadiness.readiness * 0.8 +
    performance.score * 0.2
  );

  return {
    readiness,

    performanceScore:
      performance.score,

    syllabusScore:
      existingReadiness.completionScore,

    mockScore:
      existingReadiness.mockScore,

    revisionScore:
      existingReadiness.revisionScore,

    unresolvedMistakes:
      existingReadiness.unresolvedMistakes,
  };
}
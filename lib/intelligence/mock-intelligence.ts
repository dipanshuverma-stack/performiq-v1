import { Subject } from "@prisma/client";

export type PerformanceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

interface SubjectPerformance {
  subject: Subject;
  accuracy: number;
}

export function getMockIntelligence(
  subjectPerformances: SubjectPerformance[]
) {
  const avgAccuracy = subjectPerformances.length
    ? subjectPerformances.reduce(
        (sum, s) => sum + s.accuracy,
        0
      ) / subjectPerformances.length
    : 0;

  const performanceLevel: PerformanceLevel =
    avgAccuracy >= 80
      ? "Advanced"
      : avgAccuracy >= 65
      ? "Intermediate"
      : "Beginner";

  const ascending = [...subjectPerformances].sort(
    (a, b) => a.accuracy - b.accuracy
  );

  const descending = [...ascending].reverse();

  const strongestSubjects = descending
    .filter((s) => s.accuracy >= 75)
    .slice(0, 3)
    .map((s) => s.subject);

  const weakestSubjects = ascending
    .filter((s) => s.accuracy < 60)
    .slice(0, 3)
    .map((s) => s.subject);

  const recommendedPractice = weakestSubjects.length
    ? weakestSubjects
    : ascending.slice(0, 3).map((s) => s.subject);

  const targetAccuracy = Math.min(
    90,
    Math.round(avgAccuracy + 5)
  );

  const confidenceScore = Math.min(
    100,
    Math.round(avgAccuracy * 1.1)
  );

  return {
    performanceLevel,
    avgAccuracy: Number(avgAccuracy.toFixed(2)),
    strongestSubject: strongestSubjects[0] ?? null,
    weakestSubject:
      weakestSubjects[0] ??
      recommendedPractice[0] ??
      null,
    recommendedPractice,
    targetAccuracy,
    confidenceScore,
  };
}
import { Subject } from "@prisma/client";

export type PerformanceLevel = "Beginner" | "Intermediate" | "Advanced";

interface SubjectPerformance {
  subject: Subject;
  accuracy: number;
}

export function getMockIntelligence(
  subjectPerformances: SubjectPerformance[]
) {
  if (subjectPerformances.length === 0) {
    return {
      performanceLevel: "Beginner" as PerformanceLevel,
      avgAccuracy: 0,
      strongestSubject: null,
      weakestSubject: null,
      recommendedPractice: [],
      targetAccuracy: 90,
      confidenceScore: 0,
    };
  }

  const avgAccuracy = subjectPerformances.reduce(
    (sum, s) => sum + s.accuracy,
    0
  ) / subjectPerformances.length;

  const performanceLevel: PerformanceLevel =
    avgAccuracy >= 80 ? "Advanced" :
    avgAccuracy >= 65 ? "Intermediate" : "Beginner";

  // Sort once and reuse
  const sorted = [...subjectPerformances].sort((a, b) => b.accuracy - a.accuracy);

  const strongestSubjects = sorted
    .filter((s) => s.accuracy >= 75)
    .slice(0, 3)
    .map((s) => s.subject);

  const weakestSubjects = sorted
    .slice()
    .reverse()
    .filter((s) => s.accuracy < 60)
    .slice(0, 3)
    .map((s) => s.subject);

  const recommendedPractice = weakestSubjects.length
    ? weakestSubjects
    : sorted.slice(0, 3).map((s) => s.subject);

  return {
    performanceLevel,
    avgAccuracy: Number(avgAccuracy.toFixed(2)),
    strongestSubject: strongestSubjects[0] ?? null,
    weakestSubject: weakestSubjects[0] ?? recommendedPractice[0] ?? null,
    recommendedPractice,
    targetAccuracy: Math.min(90, Math.round(avgAccuracy + 5)),
    confidenceScore: Math.min(100, Math.round(avgAccuracy * 1.1)),
  };
}
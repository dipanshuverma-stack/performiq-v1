export type SubjectPerformance = {
  subject: string;
  accuracy: number;
};

export async function getMockIntelligence(
  subjectPerformances: SubjectPerformance[]
) {
  // 1. Calculate base arrays using explicit immutability to prevent array mutation
  const strongestSubjects = [...subjectPerformances]
    .filter((s) => s.accuracy >= 75)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3)
    .map((s) => s.subject);

  const weakestSubjects = [...subjectPerformances]
    .filter((s) => s.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((s) => s.subject);

  const recommendedPractice =
    weakestSubjects.length > 0
      ? weakestSubjects
      : [...subjectPerformances]
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 3)
          .map((s) => s.subject);

  // 2. Single Strongest & Weakest Subject Extractions
  const strongestSubject = strongestSubjects[0] ?? null;
  
  // Prioritize an absolute weak area (<60%) before falling back to a relative lowest score
  const weakestSubject =
    weakestSubjects[0] ??
    recommendedPractice[0] ??
    null;

  // 3. Target Accuracy Calculations
  const avgAccuracy = subjectPerformances.length > 0
    ? subjectPerformances.reduce((sum, s) => sum + s.accuracy, 0) / subjectPerformances.length
    : 0;

  const targetAccuracy = Math.min(
    90,
    Math.round(avgAccuracy + 5)
  );

  // 4. Dynamic Performance Level Assignment
  let performanceLevel = "Beginner";

  if (avgAccuracy >= 80) {
    performanceLevel = "Advanced";
  } else if (avgAccuracy >= 65) {
    performanceLevel = "Intermediate";
  }

  // 5. Virtual Client-side Confidence Score calculation
  const confidenceScore = Math.min(
    100,
    Math.round(avgAccuracy * 1.1)
  );

  // 6. Return rounded, UI-optimized response payload
  return {
    strongestSubject,
    weakestSubject,
    strongestSubjects,
    weakestSubjects,
    recommendedPractice,
    averageAccuracy: Math.round(avgAccuracy),
    targetAccuracy,
    performanceLevel,
    confidenceScore,
  };
}
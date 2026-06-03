export type SubjectPerformance = {
  subject: string;
  accuracy: number;
};

export async function getMockIntelligence(
  subjectPerformances: SubjectPerformance[]
) {
  const strongestSubjects = subjectPerformances
    .filter((s) => s.accuracy >= 75)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3)
    .map((s) => s.subject);

  const weakestSubjects = subjectPerformances
    .filter((s) => s.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((s) => s.subject);

  const recommendedPractice =
    weakestSubjects.length > 0
      ? weakestSubjects
      : subjectPerformances
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 3)
          .map((s) => s.subject);

  return {
    strongestSubjects,
    weakestSubjects,
    recommendedPractice,
  };
}
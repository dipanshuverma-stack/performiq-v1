import { prisma } from "@/lib/prisma";

export async function getSubjectIntelligence(
  userId: string
) {
  const performances =
    await prisma.mockSubjectPerformance.findMany({
      where: {
        userId,
      },
    });

  const subjects = [
    "Reasoning",
    "Quant",
    "English",
    "GA",
    "Computer",
  ];

  const intelligence = subjects
    .map((subject) => {
      const records = performances.filter(
        (item) => item.subject === subject
      );

      if (records.length === 0) {
        return null;
      }

      const averageScore =
        records.reduce(
          (sum, item) => sum + item.score,
          0
        ) / records.length;

      const averageAccuracy =
        records.reduce(
          (sum, item) => sum + item.accuracy,
          0
        ) / records.length;

      return {
        subject,
        mocks: records.length,
        averageScore: Number(
          averageScore.toFixed(2)
        ),
        averageAccuracy: Number(
          averageAccuracy.toFixed(2)
        ),
      };
    })
    .filter(
  (
    item
  ): item is {
    subject: string;
    mocks: number;
    averageScore: number;
    averageAccuracy: number;
  } => item !== null
);

  const sorted = [...intelligence].sort(
    (a, b) => b.averageScore - a.averageScore
  );

  return {
    subjects: intelligence,
    strongestSubject:
      sorted.length > 0 ? sorted[0] : null,
    weakestSubject:
      sorted.length > 0
        ? sorted[sorted.length - 1]
        : null,
  };
}
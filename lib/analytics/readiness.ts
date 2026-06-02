import { prisma } from "@/lib/prisma";

export async function getReadinessScore(
  userId: string
) {
  const [
    topicTotal,
    topicCompleted,
    mockStats,
    revisions,
    mistakes,
  ] = await Promise.all([
    prisma.topicProgress.count({
      where: { userId },
    }),

    prisma.topicProgress.count({
      where: {
        userId,
        completed: true,
      },
    }),

    prisma.mockTest.aggregate({
      where: { userId },
      _avg: {
        accuracy: true,
      },
    }),

    prisma.revision.count({
      where: {
        userId,
      },
    }),

    prisma.mistakeEntry.count({
      where: {
        userId,
        resolved: false,
      },
    }),
  ]);

  const completionScore =
    topicTotal > 0
      ? (topicCompleted / topicTotal) * 40
      : 0;

  const avgAccuracy =
    mockStats._avg.accuracy ?? 0;

  const mockScore =
    (avgAccuracy / 100) * 30;

  const revisionScore =
    revisions > 0 ? 20 : 0;

  const mistakePenalty =
    Math.min(mistakes, 10);

  const readiness = Math.max(
    0,
    Math.round(
      completionScore +
        mockScore +
        revisionScore -
        mistakePenalty
    )
  );

  return {
    readiness,

    completionScore:
      Math.round(completionScore),

    mockScore:
      Math.round(mockScore),

    revisionScore,

    unresolvedMistakes:
      mistakes,
  };
}
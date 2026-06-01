import { prisma } from "@/lib/prisma";

export async function getReadiness(
  userId: string
) {
  const mockCount =
    await prisma.mockTest.count({
      where: { userId },
    });

  const completedTopics =
    await prisma.topicProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

  const studySessions =
    await prisma.studySession.count({
      where: { userId },
    });

  const accuracy =
    (
      await prisma.mockTest.aggregate({
        where: { userId },
        _avg: {
          accuracy: true,
        },
      })
    )._avg.accuracy ?? 0;

  const readiness =
    accuracy * 0.5 +
    Math.min(mockCount, 20) * 1 +
    Math.min(completedTopics, 100) * 0.2 +
    Math.min(studySessions, 100) * 0.1;

  return Math.min(
    Number(readiness.toFixed(1)),
    100
  );
}
import { prisma } from "@/lib/prisma";

export const TARGET_PRELIMS_QPM = 1.67;

export async function getPracticeAnalytics(
  userId: string
) {
  const stats =
    await prisma.practiceSession.aggregate({
      where: { userId },

      _count: {
        id: true,
      },

      _avg: {
        accuracy: true,
        qpm: true,
      },

      _sum: {
        totalQuestions: true,
        durationSeconds: true,
      },
    });

  const totalSessions =
    stats._count.id;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      averageAccuracy: 0,
      averageQPM: 0,
      speedScore: 0,
      totalQuestions: 0,
      totalPracticeHours: 0,
      bestTopic: null,
      weakestTopic: null,
    };
  }

  const averageAccuracy =
    stats._avg.accuracy ?? 0;

  const averageQPM =
    stats._avg.qpm ?? 0;

  const totalQuestions =
    stats._sum.totalQuestions ?? 0;

  const totalSeconds =
    stats._sum.durationSeconds ?? 0;

  const speedScore = Math.min(
    100,
    (averageQPM /
      TARGET_PRELIMS_QPM) *
      100
  );

  return {
    totalSessions,

    averageAccuracy:
      Math.round(
        averageAccuracy * 10
      ) / 10,

    averageQPM:
      Math.round(
        averageQPM * 100
      ) / 100,

    speedScore:
      Math.round(speedScore),

    totalQuestions,

    totalPracticeHours:
      Math.round(
        (totalSeconds / 3600) * 10
      ) / 10,

    bestTopic: null,

    weakestTopic: null,
  };
}
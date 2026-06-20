import { prisma } from "@/lib/prisma";

export const TARGET_PRELIMS_QPM = 1.67;

export async function getPracticeAnalytics(userId: string) {
  const [stats, topicStats] = await Promise.all([
    prisma.practiceSession.aggregate({
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
    }),

    prisma.practiceSession.groupBy({
      by: ["topic"],

      where: {
        userId,
      },

      _count: {
        id: true,
      },

      _avg: {
        accuracy: true,
        qpm: true,
      },
    }),
  ]);

  const totalSessions = stats._count.id;

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

  const averageAccuracy = stats._avg.accuracy ?? 0;
  const averageQPM = stats._avg.qpm ?? 0;
  const totalQuestions = stats._sum.totalQuestions ?? 0;
  const totalSeconds = stats._sum.durationSeconds ?? 0;

  const speedScore = Math.min(
    100,
    (averageQPM / TARGET_PRELIMS_QPM) * 100
  );

  const eligibleTopics = topicStats.filter(
    (topic) => topic._count.id >= 3
  );

  const bestTopic =
    eligibleTopics.length > 0
      ? [...eligibleTopics].sort((a, b) => {
          const accuracyDiff =
            (b._avg.accuracy ?? 0) -
            (a._avg.accuracy ?? 0);

          if (accuracyDiff !== 0) {
            return accuracyDiff;
          }

          return (
            (b._avg.qpm ?? 0) -
            (a._avg.qpm ?? 0)
          );
        })[0]
      : null;

  const weakestTopic =
    eligibleTopics.length > 0
      ? [...eligibleTopics].sort((a, b) => {
          const accuracyDiff =
            (a._avg.accuracy ?? 0) -
            (b._avg.accuracy ?? 0);

          if (accuracyDiff !== 0) {
            return accuracyDiff;
          }

          return (
            (a._avg.qpm ?? 0) -
            (b._avg.qpm ?? 0)
          );
        })[0]
      : null;

  return {
    totalSessions,

    averageAccuracy:
      Math.round(averageAccuracy * 10) / 10,

    averageQPM:
      Math.round(averageQPM * 100) / 100,

    speedScore:
      Math.round(speedScore),

    totalQuestions,

    totalPracticeHours:
      Math.round((totalSeconds / 3600) * 10) / 10,

    bestTopic: bestTopic && {
      topic: bestTopic.topic,
      accuracy:
        Math.round((bestTopic._avg.accuracy ?? 0) * 10) / 10,
      qpm:
        Math.round((bestTopic._avg.qpm ?? 0) * 100) / 100,
      sessions: bestTopic._count.id,
    },

    weakestTopic: weakestTopic && {
      topic: weakestTopic.topic,
      accuracy:
        Math.round((weakestTopic._avg.accuracy ?? 0) * 10) / 10,
      qpm:
        Math.round((weakestTopic._avg.qpm ?? 0) * 100) / 100,
      sessions: weakestTopic._count.id,
    },
  };
}
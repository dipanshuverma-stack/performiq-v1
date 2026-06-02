import { prisma } from "@/lib/prisma";

export const TARGET_PRELIMS_QPM = 1.67;

export async function getPracticeAnalytics(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: {
        userId,
      },
    });

  if (sessions.length === 0) {
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

  const totalSessions =
    sessions.length;

  const averageAccuracy =
    sessions.reduce(
      (sum, s) => sum + s.accuracy,
      0
    ) / totalSessions;

  const averageQPM =
    sessions.reduce(
      (sum, s) => sum + s.qpm,
      0
    ) / totalSessions;

  const totalQuestions =
    sessions.reduce(
      (sum, s) =>
        sum + s.totalQuestions,
      0
    );

  const totalSeconds =
    sessions.reduce(
      (sum, s) =>
        sum + s.durationSeconds,
      0
    );

  const speedScore =
    Math.min(
      100,
      (averageQPM /
        TARGET_PRELIMS_QPM) *
        100
    );

  const topicMap = new Map<
    string,
    number[]
  >();

  sessions.forEach((session) => {
    const scores =
      topicMap.get(session.topic) ||
      [];

    scores.push(session.accuracy);

    topicMap.set(
      session.topic,
      scores
    );
  });

  let bestTopic = null;
  let weakestTopic = null;

  let bestScore = -1;
  let worstScore = 101;

  topicMap.forEach(
    (scores, topic) => {
      const avg =
        scores.reduce(
          (a, b) => a + b,
          0
        ) / scores.length;

      if (avg > bestScore) {
        bestScore = avg;
        bestTopic = topic;
      }

      if (avg < worstScore) {
        worstScore = avg;
        weakestTopic = topic;
      }
    }
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

    bestTopic,
    weakestTopic,
  };
}
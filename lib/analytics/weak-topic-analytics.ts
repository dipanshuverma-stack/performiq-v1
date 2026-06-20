import { prisma } from "@/lib/prisma";

export interface WeakTopic {
  subject: string;
  topic: string;
  accuracy: number;
  qpm: number;
  sessions: number;
  priorityScore: number;
}

export async function getWeakTopics(
  userId: string
): Promise<WeakTopic[]> {
  const topics = await prisma.practiceSession.groupBy({
    by: ["subject", "topic"],

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
  });

  return topics
    .filter((t) => t._count.id >= 3)
    .map((t) => {
      const accuracy = t._avg.accuracy ?? 0;
      const qpm = t._avg.qpm ?? 0;

      const priorityScore =
        (100 - accuracy) * 0.7 +
        Math.max(0, 2 - qpm) * 20;

      return {
        subject: t.subject,
        topic: t.topic,
        accuracy: Math.round(accuracy * 10) / 10,
        qpm: Math.round(qpm * 100) / 100,
        sessions: t._count.id,
        priorityScore:
          Math.round(priorityScore * 10) / 10,
      };
    })
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    );
}
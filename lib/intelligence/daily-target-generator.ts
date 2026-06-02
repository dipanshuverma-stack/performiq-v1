import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { prisma } from "@/lib/prisma";

export async function getDailyPlan(
  userId: string
) {
  const priorities =
    await getTopicPriorities(userId);

  const topTopics =
    priorities.slice(0, 3);

  const revisions =
    await prisma.revision.findMany({
      where: {
        userId,
        nextRevision: {
          lte: new Date(),
        },
      },
      take: 5,
    });

  return {
    practiceTopics: topTopics.map(
      (t) => ({
        topic: t.topic,
        targetQuestions: 20,
      })
    ),

    revisionTopics:
      revisions.map(
        (r) => r.topic
      ),
  };
}
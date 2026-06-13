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
      select: {
        topic: true,
      },
    });

  const latestMock =
    await prisma.mockTest.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        exam: true,
      },
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

    mockReviewTopics:
      latestMock
        ? [`Review ${latestMock.exam}`]
        : [],

    focusMessage:
      topTopics.length > 0
        ? `Focus on ${topTopics[0].topic} today. It currently has the highest priority.`
        : "No priority topics available today.",
  };
}
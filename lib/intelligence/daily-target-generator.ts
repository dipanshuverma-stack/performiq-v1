import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";

const cachedGetDailyPlan = cache(async (userId: string) => {
  const [priorities, revisions, latestMock] = await Promise.all([
    getTopicPriorities(userId),
    prisma.revision.findMany({
      where: {
        userId,
        nextRevision: { lte: new Date() },
      },
      take: 5,
      select: { topic: true },
    }),
    prisma.mockTest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { exam: true },
    }),
  ]);

  const topTopics = priorities.slice(0, 3);

  return {
    practiceTopics: topTopics.map((t) => ({
      topic: t.topic,
      targetQuestions: 20,
    })),

    revisionTopics: revisions.map((r) => r.topic),

    mockReviewTopics: latestMock ? [`Review ${latestMock.exam}`] : [],

    focusMessage: topTopics.length > 0
      ? `Focus on ${topTopics[0].topic} today. It currently has the highest priority.`
      : "No priority topics available today.",
  };
});

export async function getDailyPlan(userId: string) {
  return cachedGetDailyPlan(userId);
}
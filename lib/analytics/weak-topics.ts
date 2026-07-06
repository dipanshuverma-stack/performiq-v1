import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
}

const cachedGetWeakTopics = cache(async (userId: string): Promise<WeakTopic[]> => {
  const rows = await prisma.mockTopicInsight.findMany({
    where: {
      userId,
      type: "WEAK",
    },
    select: {
      id: true,
      subject: true,
      topic: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    topic: row.topic,
  }));
});

export async function getWeakTopics(userId: string): Promise<WeakTopic[]> {
  return cachedGetWeakTopics(userId);
}
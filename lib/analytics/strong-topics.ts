import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface StrongTopic {
  id: string;
  subject: string;
  topic: string;
}

const cachedGetStrongTopics = cache(async (userId: string) => {
  return prisma.mockTopicInsight.findMany({
    where: {
      userId,
      type: "STRONG",
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
});

export async function getStrongTopics(userId: string) {
  const rows = await cachedGetStrongTopics(userId);

  return rows.map((row) => ({
  id: row.id,
  subject: row.subject,
  topic: row.topic,
}));
}
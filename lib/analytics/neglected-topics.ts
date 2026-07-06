import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface NeglectedTopic {
  id: string;
  topicName?: string;     // Changed from 'topic'
  subject: string;
  completed: boolean;
  updatedAt: Date;
}

const cachedGetNeglectedTopics = cache(async (userId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.topicProgress.findMany({
    where: {
      userId,
      OR: [
        { updatedAt: { lt: thirtyDaysAgo } },
        { completed: false },
      ],
    },
    select: {
      id: true,
      topicName: true,        // ← Use correct field name
      subject: true,
      completed: true,
      updatedAt: true,
    },
    take: 20,
    orderBy: {
      updatedAt: "asc",
    },
  });
});

export async function getNeglectedTopics(userId: string) {
  return cachedGetNeglectedTopics(userId);
}
import { prisma } from "@/lib/prisma";

export async function getStrongTopics(
  userId: string
) {
  return prisma.mockTopicPerformance.findMany({
    where: {
      userId,
    },
    orderBy: {
      accuracy: "desc",
    },
    take: 10,
  });
}
import { prisma } from "@/lib/prisma";

export async function getWeakTopics(
  userId: string
) {
  const topics =
    await prisma.mockTopicPerformance.findMany({
      where: {
        userId,
      },
      orderBy: {
        accuracy: "asc",
      },
      take: 10,
    });

  return topics;
}
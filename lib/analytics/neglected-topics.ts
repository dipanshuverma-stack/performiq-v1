import { prisma } from "@/lib/prisma";

export async function getNeglectedTopics(
  userId: string
) {
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  return prisma.topicProgress.findMany({
    where: {
      userId,

      OR: [
        {
          updatedAt: {
            lt: thirtyDaysAgo,
          },
        },

        {
          completed: false,
        },
      ],
    },

    take: 20,

    orderBy: {
      updatedAt: "asc",
    },
  });
}
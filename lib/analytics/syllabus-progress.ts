import { prisma } from "@/lib/prisma";

export async function getSyllabusProgress(
  userId: string
) {
  const totalTopics =
  await prisma.topicProgress.count({
    where: {
      userId,
    },
  });

  const completedTopics =
    await prisma.topicProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

  const percentage =
  totalTopics > 0
    ? (
        (completedTopics / totalTopics) *
        100
      ).toFixed(1)
    : "0";

return {
  totalTopics,
  completedTopics,
  percentage,
};
}
import { prisma } from "@/lib/prisma";

export async function removeReward(sourceId: string) {
  const reward = await prisma.rewardLog.findFirst({
    where: {
      sourceId,
    },
  });

  // No reward exists for this source
  if (!reward) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    // 1. Delete reward log
    await tx.rewardLog.delete({
      where: {
        id: reward.id,
      },
    });

    // 2. Update reward summary
    const summary = await tx.rewardSummary.findUnique({
      where: {
        userId: reward.userId,
      },
    });

    if (summary) {
      await tx.rewardSummary.update({
        where: {
          userId: reward.userId,
        },
        data: {
          totalPoints: {
            decrement: reward.points,
          },
          weeklyPoints: {
            decrement: reward.points,
          },
          monthlyPoints: {
            decrement: reward.points,
          },
        },
      });
    }

    return reward;
  });
}
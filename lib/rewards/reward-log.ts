import { prisma } from "@/lib/prisma";
import { RewardAction, RewardType } from "@prisma/client";

import { getRewardSummary, ensureRewardPeriod } from "./summary";

export async function addReward(
  userId: string,
  rewardType: RewardType,
  action: RewardAction,
  points: number,
  title: string,
  description?: string,
  sourceId?: string
) {
  // Ignore zero-point rewards
  if (points === 0) return null;

  // Ensure summary exists
  await getRewardSummary(userId);

  // Reset week/month automatically if needed
  await ensureRewardPeriod(userId);

  // Prevent duplicate rewards
  if (sourceId) {
    const existing = await prisma.rewardLog.findFirst({
      where: {
        userId,
        sourceId,
      },
    });

    if (existing) {
      return existing;
    }
  }

  return prisma.$transaction(async (tx) => {
    // Create reward log
    const log = await tx.rewardLog.create({
      data: {
        userId,
        rewardType,
        action,
        title,
        description,
        points,
        sourceId,
      },
    });

    // Update reward summary
    const summary = await tx.rewardSummary.update({
      where: {
        userId,
      },
      data: {
        totalPoints: {
          increment: points,
        },

        weeklyPoints: {
          increment: points,
        },

        monthlyPoints: {
          increment: points,
        },
      },
    });

    return {
      log,
      summary,
    };
  });
}
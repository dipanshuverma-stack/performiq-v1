import { prisma } from "@/lib/prisma";
import { RewardAction, RewardType } from "@prisma/client";

import { getRewardSummary, ensureRewardPeriod } from "./summary";

export async function addReward(
  userId: string,
  rewardType: RewardType,
  action: RewardAction,
  points: number,
  title: string,
  description: string | undefined,
  sourceId: string
) {
  // Ignore zero-point rewards
  if (points === 0) return null;

  // Ensure summary exists
  console.time("getRewardSummary");
  const summary = await getRewardSummary(userId);
  console.timeEnd("getRewardSummary");

  // Reset week/month automatically if needed by passing the existing memory reference
  console.time("ensureRewardPeriod");
  await ensureRewardPeriod(summary);
  console.timeEnd("ensureRewardPeriod");

  return prisma.$transaction(async (tx) => {
    let log;
    try {
      log = await tx.rewardLog.create({
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
    } catch (error: any) {
      // Duplicate reward
      if (error.code === "P2002") {
        return null;
      }

      throw error;
    }

    // Update reward summary
    const updatedSummary = await tx.rewardSummary.update({
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
      summary: updatedSummary,
    };
  });
}
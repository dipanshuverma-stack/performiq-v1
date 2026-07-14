import { prisma } from "@/lib/prisma";
import { RewardAction, RewardType, Prisma } from "@prisma/client";
import { getWeekStart } from "./week";
import { getMonth } from "./month";
import { evaluateAchievementEvent } from "@/lib/achievements/evaluator";

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

  const result = await prisma.$transaction(async (tx) => {
    // 1. Find or create the target summary row
    let summary = await tx.rewardSummary.findUnique({
      where: {
        userId,
      },
    });

    if (!summary) {
      summary = await tx.rewardSummary.create({
        data: {
          userId,
          totalPoints: 0,
          weeklyPoints: 0,
          monthlyPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          weekStart: getWeekStart(),
          ...getMonth(),
        },
      });
    }

    // 2. Perform execution period evaluations natively inside the transaction
    const currentWeekStart = getWeekStart();
    const { month, year } = getMonth();
    const updates: Prisma.RewardSummaryUpdateInput = {};

    if (
      !summary.weekStart ||
      summary.weekStart.getTime() !== currentWeekStart.getTime()
    ) {
      updates.weeklyPoints = 0;
      updates.weekStart = currentWeekStart;
    }

    if (
      summary.month !== month ||
      summary.year !== year
    ) {
      updates.monthlyPoints = 0;
      updates.month = month;
      updates.year = year;
    }

    if (Object.keys(updates).length > 0) {
      summary = await tx.rewardSummary.update({
        where: {
          userId,
        },
        data: updates,
      });
    }

    // 3. Explicit pre-check to prevent duplicate logs clean without an exception block
    const existing = await tx.rewardLog.findUnique({
      where: {
        userId_sourceId: {
          userId,
          sourceId,
        },
      },
    });

    if (existing) {
      return null;
    }

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

    // 4. Update the actual incremental point gains
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

  if (result) {
    await evaluateAchievementEvent(
      userId,
      "reward_updated"
    );
  }

  return result;
}
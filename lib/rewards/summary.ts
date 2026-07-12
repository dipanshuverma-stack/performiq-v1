import { prisma } from "@/lib/prisma";
import { getWeekStart } from "./week";
import { getMonth } from "./month";

/**
 * Returns the user's RewardSummary.
 * Creates one automatically if it doesn't exist.
 */
export async function getRewardSummary(userId: string) {
  let summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
  });

  if (!summary) {
    const weekStart = getWeekStart();
    const { month, year } = getMonth();

    summary = await prisma.rewardSummary.create({
      data: {
        userId,

        totalPoints: 0,
        weeklyPoints: 0,
        monthlyPoints: 0,

        currentStreak: 0,
        longestStreak: 0,

        weekStart,
        month,
        year,
      },
    });
  }

  return summary;
}

/**
 * Automatically resets weekly/monthly counters
 * whenever a new reward period begins.
 *
 * No cron job required.
 */
export async function ensureRewardPeriod(
  summary: Awaited<ReturnType<typeof getRewardSummary>>
) {
  const currentWeekStart = getWeekStart();
  const { month, year } = getMonth();

  const updates: Record<string, any> = {};

  // Weekly reset
  if (
    !summary.weekStart ||
    summary.weekStart.getTime() !== currentWeekStart.getTime()
  ) {
    updates.weeklyPoints = 0;
    updates.weekStart = currentWeekStart;
  }

  // Monthly reset
  if (
    summary.month !== month ||
    summary.year !== year
  ) {
    updates.monthlyPoints = 0;
    updates.month = month;
    updates.year = year;
  }

  // Nothing to update
  if (Object.keys(updates).length === 0) {
    return summary;
  }

  return prisma.rewardSummary.update({
    where: {
      userId: summary.userId,
    },
    data: updates,
  });
}
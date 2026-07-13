import { prisma } from "@/lib/prisma";
import { addReward } from "./reward-log";
import { REWARD_POINTS } from "./constants";
import { RewardAction, RewardType } from "@prisma/client";

export async function updateStreak(userId: string) {
  const summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
  });

  if (!summary) {
    throw new Error("Reward summary not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = summary.lastActivityDate
    ? new Date(summary.lastActivityDate)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Case 1 — Already active today
  if (
    lastActivity &&
    lastActivity.getTime() === today.getTime()
  ) {
    return summary;
  }

  // Case 2 — Continue the streak
  if (
    lastActivity &&
    lastActivity.getTime() === yesterday.getTime()
  ) {
    const currentStreak = summary.currentStreak + 1;

    const updated = await prisma.rewardSummary.update({
      where: {
        userId,
      },
      data: {
        currentStreak,
        longestStreak: Math.max(summary.longestStreak, currentStreak),
        lastActivityDate: today,
      },
    });

    switch (currentStreak) {
      case 3:
        await addReward(
          userId,
          RewardType.STREAK,
          RewardAction.EARN,
          REWARD_POINTS.STREAK_3,
          "3 Day Streak",
          "Maintained a 3-day streak",
          `streak-3-${today.toISOString().slice(0, 10)}`
        );
        break;

      case 7:
        await addReward(
          userId,
          RewardType.STREAK,
          RewardAction.EARN,
          REWARD_POINTS.STREAK_7,
          "7 Day Streak",
          "Maintained a 7-day streak",
          `streak-7-${today.toISOString().slice(0, 10)}`
        );
        break;

      case 14:
        await addReward(
          userId,
          RewardType.STREAK,
          RewardAction.EARN,
          REWARD_POINTS.STREAK_14,
          "14 Day Streak",
          "Maintained a 14-day streak",
          `streak-14-${today.toISOString().slice(0, 10)}`
        );
        break;

      case 21:
        await addReward(
          userId,
          RewardType.STREAK,
          RewardAction.EARN,
          REWARD_POINTS.STREAK_21,
          "21 Day Streak",
          "Maintained a 21-day streak",
          `streak-21-${today.toISOString().slice(0, 10)}`
        );
        break;

      case 30:
        await addReward(
          userId,
          RewardType.STREAK,
          RewardAction.EARN,
          REWARD_POINTS.STREAK_30,
          "30 Day Streak",
          "Maintained a 30-day streak",
          `streak-30-${today.toISOString().slice(0, 10)}`
        );
        break;
    }

    return updated;
  }

  // Case 3 — Start (or restart) the streak
  return prisma.rewardSummary.update({
    where: {
      userId,
    },
    data: {
      currentStreak: 1,
      longestStreak: Math.max(
        summary.longestStreak,
        1
      ),
      lastActivityDate: today,
    },
  });
}
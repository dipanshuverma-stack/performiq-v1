import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkStreakAchievements(userId: string) {
  const summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
    select: {
      currentStreak: true,
    },
  });

  if (!summary) return;

  if (summary.currentStreak >= 3) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_3);
  }

  if (summary.currentStreak >= 7) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_7);
  }

  if (summary.currentStreak >= 30) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_30);
  }
}
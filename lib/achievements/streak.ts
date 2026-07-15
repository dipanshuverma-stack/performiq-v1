import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkStreakAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  const summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
    select: {
      currentStreak: true,
    },
  });

  if (!summary) {
    return unlocked;
  }

  if (summary.currentStreak >= 3) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.STREAK_3
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (summary.currentStreak >= 7) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.STREAK_7
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (summary.currentStreak >= 30) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.STREAK_30
    );
    if (result) {
      unlocked.push(result);
    }
  }

  return unlocked;
}
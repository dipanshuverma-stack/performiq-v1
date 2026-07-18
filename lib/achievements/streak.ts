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

  const thresholds = [
    { streak: 3, key: ACHIEVEMENT_KEYS.STREAK_3 },
    { streak: 7, key: ACHIEVEMENT_KEYS.STREAK_7 },
    { streak: 30, key: ACHIEVEMENT_KEYS.STREAK_30 },
  ];

  for (const threshold of thresholds) {
    if (summary.currentStreak >= threshold.streak) {
      const result = await unlockAchievement(userId, threshold.key);

      if (result) {
        unlocked.push(result);
      }
    }
  }

  return unlocked;
}
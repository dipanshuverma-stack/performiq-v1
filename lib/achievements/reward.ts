import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkRewardAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  const summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
  });

  if (!summary) {
    return unlocked;
  }

  const thresholds = [
    { points: 100, key: ACHIEVEMENT_KEYS.REWARD_100 },
    { points: 500, key: ACHIEVEMENT_KEYS.REWARD_500 },
    { points: 1000, key: ACHIEVEMENT_KEYS.REWARD_1000 },
  ];

  for (const threshold of thresholds) {
    if (summary.totalPoints >= threshold.points) {
      const result = await unlockAchievement(userId, threshold.key);

      if (result) {
        unlocked.push(result);
      }
    }
  }

  return unlocked;
}
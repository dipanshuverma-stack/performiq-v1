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

  if (summary.totalPoints >= 100) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.REWARD_100
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (summary.totalPoints >= 500) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.REWARD_500
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (summary.totalPoints >= 1000) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.REWARD_1000
    );
    if (result) {
      unlocked.push(result);
    }
  }

  return unlocked;
}
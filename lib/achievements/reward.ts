import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkRewardAchievements(userId: string) {
  const summary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
  });

  if (!summary) return;

  if (summary.totalPoints >= 100) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_100);
  }

  if (summary.totalPoints >= 500) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_500);
  }

  if (summary.totalPoints >= 1000) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_1000);
  }
}
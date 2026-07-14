import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkPracticeAchievements(userId: string) {
  const practiceCount = await prisma.practiceSession.count({
    where: {
      userId,
    },
  });

  if (practiceCount >= 1) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.FIRST_PRACTICE);
  }

  if (practiceCount >= 10) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_10);
  }

  if (practiceCount >= 50) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_50);
  }

  if (practiceCount >= 100) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_100);
  }
}
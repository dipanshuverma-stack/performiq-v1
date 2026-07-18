import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkPracticeAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  const practiceCount = await prisma.practiceSession.count({
    where: {
      userId,
    },
  });

  const practiceThresholds = [
    { count: 1, key: ACHIEVEMENT_KEYS.FIRST_PRACTICE },
    { count: 10, key: ACHIEVEMENT_KEYS.PRACTICE_10 },
    { count: 25, key: ACHIEVEMENT_KEYS.PRACTICE_25 },
    { count: 50, key: ACHIEVEMENT_KEYS.PRACTICE_50 },
    { count: 100, key: ACHIEVEMENT_KEYS.PRACTICE_100 },
    { count: 250, key: ACHIEVEMENT_KEYS.PRACTICE_250 },
    { count: 500, key: ACHIEVEMENT_KEYS.PRACTICE_500 },
  ];

  for (const threshold of practiceThresholds) {
    if (practiceCount >= threshold.count) {
      const result = await unlockAchievement(userId, threshold.key);
      if (result) {
        unlocked.push(result);
      }
    }
  }

  return unlocked;
}
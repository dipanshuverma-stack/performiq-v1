import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkMockAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  const mockCount = await prisma.mockTest.count({
    where: {
      userId,
    },
  });

  const thresholds = [
    { count: 1, key: ACHIEVEMENT_KEYS.FIRST_MOCK },
    { count: 10, key: ACHIEVEMENT_KEYS.MOCK_10 },
    { count: 25, key: ACHIEVEMENT_KEYS.MOCK_25 },
    { count: 50, key: ACHIEVEMENT_KEYS.MOCK_50 },
  ];

  for (const threshold of thresholds) {
    if (mockCount >= threshold.count) {
      const result = await unlockAchievement(userId, threshold.key);

      if (result) {
        unlocked.push(result);
      }
    }
  }

  return unlocked;
}
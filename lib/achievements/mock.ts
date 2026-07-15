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

  if (mockCount >= 1) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.FIRST_MOCK
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (mockCount >= 10) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.MOCK_10
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (mockCount >= 50) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.MOCK_50
    );
    if (result) {
      unlocked.push(result);
    }
  }

  return unlocked;
}
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkMockAchievements(userId: string) {
  const mockCount = await prisma.mockTest.count({
    where: {
      userId,
    },
  });

  if (mockCount >= 1) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.FIRST_MOCK);
  }

  if (mockCount >= 10) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.MOCK_10);
  }

  if (mockCount >= 50) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.MOCK_50);
  }
}
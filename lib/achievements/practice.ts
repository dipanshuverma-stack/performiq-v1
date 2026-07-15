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

  if (practiceCount >= 1) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.FIRST_PRACTICE
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (practiceCount >= 10) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.PRACTICE_10
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (practiceCount >= 50) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.PRACTICE_50
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (practiceCount >= 100) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.PRACTICE_100
    );
    if (result) {
      unlocked.push(result);
    }
  }

  return unlocked;
}
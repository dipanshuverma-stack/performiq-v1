import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_LIST } from "./catalog";

export async function getAchievements(userId: string) {
  const unlocked = await prisma.userAchievement.findMany({
    where: {
      userId,
    },
    select: {
      achievementId: true,
      unlockedAt: true,
      achievement: {
        select: {
          key: true,
        },
      },
    },
  });

  const unlockedKeys = new Set(
    unlocked.map((item) => item.achievement.key)
  );

  return ACHIEVEMENT_LIST.map((achievement) => ({
    ...achievement,
    unlocked: unlockedKeys.has(achievement.key),
    unlockedAt:
      unlocked.find(
        (item) => item.achievement.key === achievement.key
      )?.unlockedAt ?? null,
  }));
}

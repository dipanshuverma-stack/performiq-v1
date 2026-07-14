import { prisma } from "@/lib/prisma";

export type UnlockResult =
  | {
      unlocked: true;
      achievement: {
        id: string;
        key: string;
        title: string;
        description: string;
        icon: string;
        rewardPoints: number;
        xp: number;
        rarity: string;
      };
    }
  | null;

export async function unlockAchievement(
  userId: string,
  achievementKey: string
): Promise<UnlockResult> {
  // 1. Find achievement definition
  const achievement = await prisma.achievement.findUnique({
    where: {
      key: achievementKey,
    },
  });

  if (!achievement) return null;

  // 2. Already unlocked?
  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existing) return null;

  // 3. Unlock achievement
  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });

  return {
    unlocked: true as const,
    achievement: {
      id: achievement.id,
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      rewardPoints: achievement.rewardPoints,
      xp: achievement.xp,
      rarity: achievement.rarity,
    },
  };
}
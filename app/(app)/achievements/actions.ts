"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getAchievements() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return null;
  }

  const achievements = await prisma.achievement.findMany({
    include: {
      users: {
        where: {
          userId: user.id,
        },
        select: {
          unlockedAt: true,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const unlocked = achievements.filter(
    (a) => a.users.length > 0
  ).length;

  const unlockedAchievements = achievements.filter(
    (a) => a.users.length > 0
  );

  const totalRewardPoints = unlockedAchievements.reduce(
    (sum, achievement) => sum + (achievement.rewardPoints ?? 0),
    0
  );

  const totalXp = unlockedAchievements.reduce(
    (sum, achievement) => sum + (achievement.xp ?? 0),
    0
  );

  return {
    achievements,

    stats: {
      total: achievements.length,
      unlocked,
      locked: achievements.length - unlocked,
      completion:
        achievements.length === 0
          ? 0
          : Math.round(
              (unlocked / achievements.length) * 100
            ),
      rewardPoints: totalRewardPoints,
      xp: totalXp,
    },
  };
}

export async function getPreparationJourney() {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return [];
  }

  return prisma.rewardLog.findMany({
    where: {
      userId: user.id,
      action: "EARN",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      rewardType: true,
      title: true,
      description: true,
      points: true,
      createdAt: true,
    },
  });
}
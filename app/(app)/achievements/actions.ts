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
    },
  };
}
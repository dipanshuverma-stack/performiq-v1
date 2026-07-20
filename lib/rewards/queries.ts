import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getStudyStreak = cache(async (userId: string) => {
  const rewardSummary = await prisma.rewardSummary.findUnique({
    where: { userId },
    select: {
      currentStreak: true,
      longestStreak: true,
    },
  });

  return {
    currentStreak: rewardSummary?.currentStreak ?? 0,
    longestStreak: rewardSummary?.longestStreak ?? 0,
  };
});
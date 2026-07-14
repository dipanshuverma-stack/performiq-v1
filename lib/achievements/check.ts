import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkAchievements(userId: string) {
  // ---------- Planner ----------
  const plannerCount = await prisma.task.count({
    where: {
      userId,
      completed: true,
    },
  });

  if (plannerCount >= 1) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.FIRST_TASK);
  }

  if (plannerCount >= 25) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PLANNER_25);
  }

  if (plannerCount >= 100) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PLANNER_100);
  }

  // ---------- Practice ----------
  const practiceCount = await prisma.practiceSession.count({
    where: {
      userId,
    },
  });

  if (practiceCount >= 1) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.FIRST_PRACTICE);
  }

  if (practiceCount >= 10) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_10);
  }

  if (practiceCount >= 50) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_50);
  }

  if (practiceCount >= 100) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PRACTICE_100);
  }

  // ---------- Mock ----------
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

  // ---------- Rewards ----------
  const rewardSummary = await prisma.rewardSummary.findUnique({
    where: {
      userId,
    },
  });

  if (rewardSummary) {
    if (rewardSummary.totalPoints >= 100) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_100);
    }

    if (rewardSummary.totalPoints >= 500) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_500);
    }

    if (rewardSummary.totalPoints >= 1000) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.REWARD_1000);
    }

    if (rewardSummary.currentStreak >= 3) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_3);
    }

    if (rewardSummary.currentStreak >= 7) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_7);
    }

    if (rewardSummary.currentStreak >= 30) {
      await unlockAchievement(userId, ACHIEVEMENT_KEYS.STREAK_30);
    }
  }
}
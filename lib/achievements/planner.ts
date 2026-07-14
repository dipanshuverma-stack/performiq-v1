import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement } from "./unlock";

export async function checkPlannerAchievements(userId: string) {
  const completedTasks = await prisma.task.count({
    where: {
      userId,
      completed: true,
    },
  });

  if (completedTasks >= 1) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.FIRST_TASK);
  }

  if (completedTasks >= 25) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PLANNER_25);
  }

  if (completedTasks >= 100) {
    await unlockAchievement(userId, ACHIEVEMENT_KEYS.PLANNER_100);
  }
}
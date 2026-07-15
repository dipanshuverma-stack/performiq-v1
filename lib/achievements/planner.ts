import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkPlannerAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  const completedTasks = await prisma.task.count({
    where: {
      userId,
      completed: true,
    },
  });

  if (completedTasks >= 1) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.FIRST_TASK
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (completedTasks >= 25) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.PLANNER_25
    );
    if (result) {
      unlocked.push(result);
    }
  }

  if (completedTasks >= 100) {
    const result = await unlockAchievement(
      userId,
      ACHIEVEMENT_KEYS.PLANNER_100
    );
    if (result) {
      unlocked.push(result);
    }
  }

  return unlocked;
}
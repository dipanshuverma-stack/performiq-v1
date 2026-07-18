import { prisma } from "@/lib/prisma";
import { ACHIEVEMENT_KEYS } from "./constants";
import { unlockAchievement, type UnlockResult } from "./unlock";

export async function checkPlannerAchievements(
  userId: string
): Promise<UnlockResult[]> {
  const unlocked: UnlockResult[] = [];

  // Querying the active WeeklyPlan model for completed planner items
  const completedTasks = await prisma.weeklyPlan.count({
    where: {
      userId,
      completed: true,
    },
  });

  // Array map representing each completion threshold and its corresponding key
  const thresholds = [
    { count: 1, key: ACHIEVEMENT_KEYS.FIRST_TASK },
    { count: 10, key: ACHIEVEMENT_KEYS.PLANNER_10 },
    { count: 25, key: ACHIEVEMENT_KEYS.PLANNER_25 },
    { count: 50, key: ACHIEVEMENT_KEYS.PLANNER_50 },
    { count: 100, key: ACHIEVEMENT_KEYS.PLANNER_100 },
    { count: 250, key: ACHIEVEMENT_KEYS.PLANNER_250 },
    { count: 500, key: ACHIEVEMENT_KEYS.PLANNER_500 },
  ];

  for (const threshold of thresholds) {
    if (completedTasks >= threshold.count) {
      const result = await unlockAchievement(userId, threshold.key);
      if (result) {
        unlocked.push(result);
      }
    }
  }

  return unlocked;
}
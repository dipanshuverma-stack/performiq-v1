import { checkPlannerAchievements } from "./planner";
import { checkPracticeAchievements } from "./practice";
import { checkMockAchievements } from "./mock";
import { checkRewardAchievements } from "./reward";
import { checkStreakAchievements } from "./streak";
import { type UnlockResult } from "./unlock";

export type AchievementEvent =
  | "planner_completed"
  | "practice_completed"
  | "mock_completed"
  | "reward_updated"
  | "streak_updated";

const handlers: Record<
  AchievementEvent,
  (userId: string) => Promise<UnlockResult[]>
> = {
  planner_completed: checkPlannerAchievements,
  practice_completed: checkPracticeAchievements,
  mock_completed: checkMockAchievements,
  reward_updated: checkRewardAchievements,
  streak_updated: checkStreakAchievements,
};

export async function evaluateAchievements(
  userId: string,
  event: AchievementEvent
): Promise<UnlockResult[]> {
  return handlers[event](userId);
}
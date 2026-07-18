import {
  checkMockAchievements,
  checkPlannerAchievements,
  checkPracticeAchievements,
  checkRewardAchievements,
  checkStreakAchievements,
} from ".";

import { type UnlockResult } from "./unlock";

export type AchievementEvent =
  | "practice_completed"
  | "mock_completed"
  | "planner_completed"
  | "reward_updated"
  | "streak_updated";

export async function evaluateAchievementEvent(
  userId: string,
  event: AchievementEvent
) {
  let unlocked: UnlockResult[] = [];

  switch (event) {
    case "practice_completed":
      unlocked = await checkPracticeAchievements(userId);
      break;

    case "mock_completed":
      unlocked = await checkMockAchievements(userId);
      break;

    case "planner_completed":
      unlocked = await checkPlannerAchievements(userId);
      break;

    case "reward_updated":
      unlocked = await checkRewardAchievements(userId);
      break;

    case "streak_updated":
      unlocked = await checkStreakAchievements(userId);
      break;
  }

  return unlocked;
}
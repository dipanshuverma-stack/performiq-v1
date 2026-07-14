import {
  checkMockAchievements,
  checkPlannerAchievements,
  checkPracticeAchievements,
  checkRewardAchievements,
  checkStreakAchievements,
} from ".";

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
  switch (event) {
    case "practice_completed":
      await checkPracticeAchievements(userId);
      break;

    case "mock_completed":
      await checkMockAchievements(userId);
      break;

    case "planner_completed":
      await checkPlannerAchievements(userId);
      break;

    case "reward_updated":
      await checkRewardAchievements(userId);
      break;

    case "streak_updated":
      await checkStreakAchievements(userId);
      break;
  }
}
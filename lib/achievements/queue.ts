import { UnlockResult } from "./unlock";

const queue: UnlockResult[] = [];

export function enqueueAchievements(
  achievements: UnlockResult[]
) {
  for (const achievement of achievements) {
    if (achievement) {
      queue.push(achievement);
    }
  }
}

export function dequeueAchievement() {
  return queue.shift() ?? null;
}

export function hasQueuedAchievements() {
  return queue.length > 0;
}
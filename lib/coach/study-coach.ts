import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { getPerformanceScore } from "@/lib/analytics/performance-score";

export async function getStudyCoach(userId: string) {
  const [priorities, performance] = await Promise.all([
    getTopicPriorities(userId),
    getPerformanceScore(userId),
  ]);

  const top3 = priorities.slice(0, 3);
  const messages: string[] = [];

  if (performance.accuracy < 60) {
    messages.push(
      "Accuracy is critically low. Focus on solving fewer questions with higher precision."
    );
  } else if (performance.accuracy < 80) {
    messages.push(
      "Accuracy is improving, but should reach 80%+ before increasing difficulty."
    );
  }

  if (performance.speedScore < 50) {
    messages.push(
      "Speed is significantly below exam pace. Add timed practice sessions."
    );
  } else if (performance.speedScore < 70) {
    messages.push(
      "Speed is improving. Continue practicing under time pressure."
    );
  }

  if (top3.length > 0) {
    messages.push(
      `Your highest-priority topic is ${top3[0].topic}.`
    );
  }

  if (top3.length > 1) {
    messages.push(
      `Secondary focus: ${top3[1].topic}.`
    );
  }

  return {
    focusTopics: top3,
    messages,

    performance: {
      accuracy: performance.accuracy,
      speedScore: performance.speedScore,
    },
  };
}
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { getPerformanceScore } from "@/lib/analytics/performance-score";

export async function getStudyCoach(
  userId: string
) {
  const [
    priorities,
    performance,
  ] = await Promise.all([
    getTopicPriorities(userId),
    getPerformanceScore(userId),
  ]);

  const top3 =
    priorities.slice(0, 3);

  const messages: string[] = [];

  if (
    performance.accuracy < 80
  ) {
    messages.push(
      "Focus on accuracy before increasing speed."
    );
  }

  if (
    performance.speedScore < 70
  ) {
    messages.push(
      "Increase question volume to improve speed."
    );
  }

  if (
    top3.length > 0
  ) {
    messages.push(
      `Prioritize ${top3[0].topic}.`
    );
  }

  return {
    focusTopics: top3,
    messages,
  };
}
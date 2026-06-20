import { getReadinessEngine } from "./readiness-engine";
import { getWeakTopics } from "./weak-topic-analytics";
import { getPracticeConsistency } from "./practice-consistency";

export async function getDashboardIntelligence(
  userId: string
) {
  const [
    readiness,
    weakTopics,
    consistency,
  ] = await Promise.all([
    getReadinessEngine(userId),
    getWeakTopics(userId),
    getPracticeConsistency(userId),
  ]);

  const priorities = weakTopics
    .slice(0, 5)
    .map((topic) => ({
      topic: topic.topic,

      // current mastery
      mastery: Math.round(topic.accuracy),

      // higher focus score = weaker topic
      focusScore: 100 - Math.round(topic.accuracy),
    }));

  return {
    readiness,

    currentStreak: consistency.currentStreak,

    consistencyScore: consistency.consistencyScore,

    priorities,

    strongestTopic: null,

    weakestTopic: null,

    totalSessions: 0,

    speedScore: 100,

    averageAccuracy: 0,

    averageMockScore: readiness.mockScore,

    revisionCompletion: readiness.revisionScore,

    revisionsDue: readiness.unresolvedMistakes,

    nextFocusTopic:
      priorities.length > 0
        ? priorities[0].topic
        : "Continue Practice",

    studyPlan: [],
  };
}

// ✅ Automatically infer and export the unpacked data shape for down-stream dependency injection
export type DashboardIntelligence = Awaited<
  ReturnType<typeof getDashboardIntelligence>
>;
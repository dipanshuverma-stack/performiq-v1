// lib/analytics/dashboard-intelligence.ts
import { cache } from "react";
import { getReadinessEngine } from "./readiness-engine";
import { getWeakTopics } from "./weak-topic-analytics";
import { getPracticeConsistency } from "./practice-consistency";

const getCachedReadiness = cache((userId: string) => getReadinessEngine(userId));
const getCachedWeakTopics = cache((userId: string) => getWeakTopics(userId));
const getCachedConsistency = cache((userId: string) => getPracticeConsistency(userId));

export async function getDashboardIntelligence(userId: string) {
  const [readiness, weakTopics, consistency] = await Promise.all([
    getCachedReadiness(userId),
    getCachedWeakTopics(userId),
    getCachedConsistency(userId),
  ]);

  const priorities = weakTopics
    .slice(0, 5)
    .map((topic) => ({
      topic: topic.topic,
      mastery: Math.round(topic.accuracy),
      focusScore: 100 - Math.round(topic.accuracy),
    }));

  const nextFocusTopic = priorities.length > 0 
    ? priorities[0].topic 
    : "Continue Practice";

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

    nextFocusTopic,
    studyPlan: [],

    accuracyTrend: [
      { session: 1, accuracy: 68 },
      { session: 2, accuracy: 74 },
      { session: 3, accuracy: 79 },
      { session: 4, accuracy: 85 },
      { session: 5, accuracy: 82 },
    ],
  };
}

export type DashboardIntelligence = Awaited<
  ReturnType<typeof getDashboardIntelligence>
>;
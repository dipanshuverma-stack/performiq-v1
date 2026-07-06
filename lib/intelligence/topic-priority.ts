import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Subject } from "@prisma/client";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { getTopicWeightage } from "./topic-weightage";

export type TopicPriority = {
  topic: string;
  subject: Subject;
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  knowledgeScore: number;
  speedScore: number;
  masteryScore: number;
  practiceCount: number;
  weakMockCount: number;
  strongMockCount: number;
  unresolvedMistakes: number;
  recommendedAction: "Revise" | "Timed Practice" | "Concept Building" | "Maintain";
  reasons: string[];
};

const TARGET_QPM = 1.67;

const cachedGetTopicPriorities = cache(async (userId: string): Promise<TopicPriority[]> => {
  const activeExam = await getActiveExam(userId);

  // --------------------------------
  // Fetch Raw Data
  // --------------------------------
  const [practiceSessions, mistakes, mockTopics] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId },
      select: { topic: true, subject: true, accuracy: true, qpm: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.mistakeEntry.findMany({
      where: { userId, resolved: false },
      select: { topic: true, subject: true },
    }),
    prisma.mockTopicInsight.findMany({
      where: { userId },
      select: { topic: true, subject: true, type: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  // 1. Use subject + topic as the map key (Composite Key)
  const allKeys = new Set<string>();
  const topicMetaMap = new Map<string, { topic: string; subject: Subject }>();
  
  const mistakeCountMap = new Map<string, number>();
  const practiceMap = new Map<string, { accuracies: number[]; qpms: number[] }>();
  const weakMockMap = new Map<string, number>();
  const strongMockMap = new Map<string, number>();

  // --------------------------------
  // Aggregate Practice & Mistake History
  // --------------------------------
  mistakes.forEach((m) => {
    const key = `${m.subject}:${m.topic}`;
    allKeys.add(key);
    topicMetaMap.set(key, { topic: m.topic, subject: m.subject });
    mistakeCountMap.set(key, (mistakeCountMap.get(key) ?? 0) + 1);
  });

  practiceSessions.forEach((s) => {
    const key = `${s.subject}:${s.topic}`;
    allKeys.add(key);
    topicMetaMap.set(key, { topic: s.topic, subject: s.subject });
    
    const existing = practiceMap.get(key) ?? { accuracies: [], qpms: [] };
    existing.accuracies.push(s.accuracy);
    existing.qpms.push(s.qpm);
    practiceMap.set(key, existing);
  });

  // --------------------------------
  // Aggregate Mock Intelligence
  // --------------------------------
  mockTopics.forEach((m) => {
    const key = `${m.subject}:${m.topic}`;
    allKeys.add(key);
    topicMetaMap.set(key, { topic: m.topic, subject: m.subject });

    if (m.type === "WEAK") {
      weakMockMap.set(key, (weakMockMap.get(key) ?? 0) + 1);
    }
    if (m.type === "STRONG") {
      strongMockMap.set(key, (strongMockMap.get(key) ?? 0) + 1);
    }
  });

  const priorities: TopicPriority[] = [];

  for (const key of allKeys) {
    const { topic, subject } = topicMetaMap.get(key)!;
    
    const pData = practiceMap.get(key);
    const practiceCount = pData?.accuracies.length ?? 0;

    const avgAccuracy = practiceCount > 0
      ? pData!.accuracies.reduce((a, b) => a + b, 0) / practiceCount
      : 0;

    const avgQpm = practiceCount > 0
      ? pData!.qpms.reduce((a, b) => a + b, 0) / practiceCount
      : 0;

    const weakMockCount = weakMockMap.get(key) ?? 0;
    const strongMockCount = strongMockMap.get(key) ?? 0;
    const unresolvedMistakes = mistakeCountMap.get(key) ?? 0;

    // --------------------------------
    // Calculate Composite Scores
    // --------------------------------
    
    // 2. Better knowledge score (default to neutral 50)
    const knowledgeScore = practiceCount > 0 ? Math.round(avgAccuracy) : 50;
    
    // 3. Better speed score (default to neutral 50)
    const speedScore = practiceCount > 0 ? Math.min(100, Math.round((avgQpm / TARGET_QPM) * 100)) : 50;

    // 4. Proportional Mock Confidence
    const delta = strongMockCount - weakMockCount;
    let mockConfidence = 70;
    if (delta >= 3) mockConfidence = 100;
    else if (delta === 2) mockConfidence = 90;
    else if (delta === 1) mockConfidence = 80;
    else if (delta === -1) mockConfidence = 60;
    else if (delta === -2) mockConfidence = 45;
    else if (delta <= -3) mockConfidence = 30;

    const masteryScore = Math.round(
      knowledgeScore * 0.45 +
      speedScore * 0.20 +
      mockConfidence * 0.20 +
      Math.max(0, 100 - unresolvedMistakes * 10) * 0.15
    );

    let rawScore = 0;
    const reasons: string[] = [];

    const weightage = getTopicWeightage(activeExam, topic); 
    rawScore += weightage;
    if (weightage >= 20) reasons.push("High exam weightage");

    // 6. Dynamic Penalty for Repeated Weaknesses
    if (weakMockCount > 0) {
      rawScore += Math.min(40, weakMockCount * 10);
      reasons.push(`Marked weak in ${weakMockCount} mock(s)`);
    }

    // 5. Dynamic Reward for Repeated Strengths
    if (strongMockCount > 0) {
      rawScore -= Math.min(20, strongMockCount * 5);
    }

    // Accuracy Check
    if (practiceCount > 0) {
      if (knowledgeScore < 60) {
        rawScore += 40;
        reasons.push("Very low accuracy");
      } else if (knowledgeScore < 70) {
        rawScore += 30;
        reasons.push("Low accuracy");
      } else if (knowledgeScore < 80) {
        rawScore += 20;
      } else if (knowledgeScore < 90) {
        rawScore += 10;
      }
    } else if (weakMockCount === 0 && strongMockCount === 0) {
      rawScore += 40;
      reasons.push("No performance history");
    }

    // Speed Check
    if (practiceCount > 0) {
      if (avgQpm < 0.8) {
        rawScore += 40;
        reasons.push("Very slow speed");
      } else if (avgQpm < 1.1) {
        rawScore += 30;
        reasons.push("Slow speed");
      } else if (avgQpm < 1.4) {
        rawScore += 20;
      } else if (avgQpm < TARGET_QPM) {
        rawScore += 10;
      }
    } else {
      rawScore += 20;
    }

    // Mistakes Check
    if (unresolvedMistakes >= 5) {
      rawScore += 30;
      reasons.push("Many unresolved mistakes");
    } else if (unresolvedMistakes >= 3) {
      rawScore += 20;
    } else if (unresolvedMistakes >= 1) {
      rawScore += 10;
    }

    // Final normalization
    const score = Math.min(100, Math.max(0, Math.round(rawScore)));
    const priority = score >= 80 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";

    // --------------------------------
    // Recommendation Engine
    // --------------------------------
    
    // 7. Safer, multi-variable recommendation logic
    let recommendedAction: "Revise" | "Timed Practice" | "Concept Building" | "Maintain" = "Maintain";
    
    if (weakMockCount >= 2 && unresolvedMistakes >= 2) recommendedAction = "Revise";
    else if (knowledgeScore < 60) recommendedAction = "Concept Building";
    else if (speedScore < 70 && practiceCount > 0) recommendedAction = "Timed Practice";
    else if (strongMockCount >= 3) recommendedAction = "Maintain";

    priorities.push({
      topic,
      subject,
      score,
      priority,
      knowledgeScore,
      speedScore,
      masteryScore,
      practiceCount,
      weakMockCount,
      strongMockCount,
      unresolvedMistakes,
      recommendedAction,
      reasons,
    });
  }

  // 8. Sorting with Tie-breakers
  return priorities.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Tie-breaker: prioritize topics with more unresolved mistakes
    return b.unresolvedMistakes - a.unresolvedMistakes;
  });
});

export async function getTopicPriorities(userId: string) {
  return cachedGetTopicPriorities(userId);
}
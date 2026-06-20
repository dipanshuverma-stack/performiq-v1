import { prisma } from "@/lib/prisma";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { getExamProfile } from "./exam-profile";
import { getTopicWeightage } from "./topic-weightage";
import { Subject } from "@prisma/client";

export type TopicPriority = {
  topic: string;
  subject: Subject;

  score: number; // Normalized bounded score (0 - 100)
  priority: "HIGH" | "MEDIUM" | "LOW";

  knowledgeScore: number;
  speedScore: number;
  masteryScore: number;
  
  practiceCount: number;
  mockAccuracy: number;
  unresolvedMistakes: number;
  
  recommendedAction: "Revise" | "Timed Practice" | "Concept Building" | "Maintain"; // ✅ Preserves UI Business Logic Decoupling
  reasons: string[];
};

const TARGET_QPM = 1.67;

export async function getTopicPriorities(
  userId: string
): Promise<TopicPriority[]> {
  const activeExam = await getActiveExam(userId);

  const profile = getExamProfile(
    activeExam?.name ?? ""
  );

  // Aggregating datasets concurrently. Note: practiceSessions are retrieved in strictly 
  // descending chronological order to preserve newest-first indexing rules for trends.
  const [
    practiceSessions,
    mistakes,
    mockTopics,
  ] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        topic: true,
        subject: true,
        accuracy: true,
        qpm: true,
      },
    }),

    prisma.mistakeEntry.findMany({
      where: {
        userId,
        resolved: false,
      },
      select: {
        topic: true,
        subject: true,
      },
    }),

    prisma.mockTopicPerformance.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        topic: true,
        subject: true,
        accuracy: true,
      },
    }),
  ]);

  const allTopics = new Set<string>();
  const topicSubjectMap = new Map<string, Subject>();

  const mistakeCountMap = new Map<string, number>();
  for (const mistake of mistakes) {
    allTopics.add(mistake.topic);
    topicSubjectMap.set(mistake.topic, mistake.subject);
    mistakeCountMap.set(
      mistake.topic,
      (mistakeCountMap.get(mistake.topic) ?? 0) + 1
    );
  }

  const mockAccuracyMap = new Map<string, { total: number; count: number }>();
  for (const mock of mockTopics) {
    allTopics.add(mock.topic);
    topicSubjectMap.set(mock.topic, mock.subject);
    
    const existing = mockAccuracyMap.get(mock.topic) ?? { total: 0, count: 0 };
    existing.total += mock.accuracy;
    existing.count++;
    mockAccuracyMap.set(mock.topic, existing);
  }

  const practiceMap = new Map<string, { accuracies: number[]; qpms: number[] }>();
  practiceSessions.forEach((session) => {
    allTopics.add(session.topic);
    topicSubjectMap.set(session.topic, session.subject);

    const existing = practiceMap.get(session.topic) ?? { accuracies: [], qpms: [] };
    existing.accuracies.push(session.accuracy);
    existing.qpms.push(session.qpm);
    practiceMap.set(session.topic, existing);
  });

  const priorities: TopicPriority[] = [];

  for (const topic of allTopics) {
    let rawScore = 0;
    const reasons: string[] = [];

    const subject = topicSubjectMap.get(topic) ?? Subject.QUANTITATIVE_APTITUDE;
    const pData = practiceMap.get(topic);
    const practiceCount = pData ? pData.accuracies.length : 0;

    const avgAccuracy = practiceCount > 0
      ? pData!.accuracies.reduce((a, b) => a + b, 0) / practiceCount
      : 0;

    const avgQpm = practiceCount > 0
      ? pData!.qpms.reduce((a, b) => a + b, 0) / practiceCount
      : 0;

    const mockStats = mockAccuracyMap.get(topic);
    const mockAvgAccuracy = mockStats ? mockStats.total / mockStats.count : 0;
    const unresolvedMistakes = mistakeCountMap.get(topic) ?? 0;

    const knowledgeScore = practiceCount > 0
      ? Math.round(avgAccuracy)
      : (mockStats ? Math.round(mockAvgAccuracy) : 0);

    const speedScore = Math.min(
      100,
      Math.round(((practiceCount > 0 ? avgQpm : 0) / TARGET_QPM) * 100)
    );

    const masteryScore = Math.round(
      knowledgeScore * 0.6 +
      speedScore * 0.25 +
      Math.max(0, 100 - unresolvedMistakes * 10) * 0.15
    );

    // 1. Weightage Points
    const weightage = getTopicWeightage(profile, topic);
    rawScore += weightage;
    if (weightage >= 20) {
      reasons.push("High exam weightage");
    }

    // 2. Accuracy Penalty Rules
    const evaluationAccuracy = practiceCount > 0 ? avgAccuracy : mockAvgAccuracy;
    if (practiceCount > 0 || mockStats) {
      if (evaluationAccuracy < 60) {
        rawScore += 40;
        reasons.push("Very low accuracy");
      } else if (evaluationAccuracy < 70) {
        rawScore += 30;
        reasons.push("Low accuracy");
      } else if (evaluationAccuracy < 80) {
        rawScore += 20;
      } else if (evaluationAccuracy < 90) {
        rawScore += 10;
      }
    } else {
      rawScore += 40;
      reasons.push("No performance history with active mistakes");
    }

    // 3. Speed/Pacing Velocity Penalty Rules
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

    // 4. Mistake Log Aggregations
    if (unresolvedMistakes >= 5) {
      rawScore += 30;
      reasons.push("Many unresolved mistakes");
    } else if (unresolvedMistakes >= 3) {
      rawScore += 20;
    } else if (unresolvedMistakes >= 1) {
      rawScore += 10;
    }

    // 5. Mock Weakness Markers
    if (mockStats && mockAvgAccuracy < 70) {
      rawScore += 25;
      reasons.push("Weak in mocks");
    }

    // 6. Confidence Variance Checkers
    if (practiceCount < 5) {
      rawScore += 10;
      reasons.push("Limited practice data");
    }

    // 7. Degradation and Progress Trends
    // Because elements are pushed iteratively into practiceMap from a query ordered by 
    // createdAt DESC, index 0..2 represents the newest runs, and 3..5 represents earlier ones.
    if (pData && pData.accuracies.length >= 6) {
      const recent = pData.accuracies.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const previous = pData.accuracies.slice(3, 6).reduce((a, b) => a + b, 0) / 3;

      if (recent < previous) {
        rawScore += 15;
        reasons.push("Performance declining");
      }
    }

    // ─── SCORE NORMALIZATION & BAND MATCHING ─────────────────────────
    const normalizedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    let priority: "HIGH" | "MEDIUM" | "LOW";
    if (normalizedScore >= 80) {
      priority = "HIGH";
    } else if (normalizedScore >= 50) {
      priority = "MEDIUM";
    } else {
      priority = "LOW";
    }

    // ─── SINGLE PATH RECOMMENDATION PIPELINE ─────────────────────────
    let recommendedAction: "Revise" | "Timed Practice" | "Concept Building" | "Maintain";
    if (unresolvedMistakes >= 3) {
      recommendedAction = "Revise";
    } else if (knowledgeScore < 70) {
      recommendedAction = "Concept Building";
    } else if (speedScore < 70 && practiceCount > 0) {
      recommendedAction = "Timed Practice";
    } else {
      recommendedAction = "Maintain";
    }

    priorities.push({
      topic,
      subject,
      score: normalizedScore,
      priority,
      knowledgeScore,
      speedScore,
      masteryScore,
      practiceCount,
      mockAccuracy: Math.round(mockAvgAccuracy),
      unresolvedMistakes,
      recommendedAction,
      reasons,
    });
  }

  return priorities.sort((a, b) => b.score - a.score);
}
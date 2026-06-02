import { prisma } from "@/lib/prisma";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { getExamProfile } from "./exam-profile";
import { getTopicWeightage } from "./topic-weightage";

export type TopicPriority = {
  topic: string;
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  knowledgeScore: number;
  speedScore: number;
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

  // Optimized database aggregation by selecting only required fields and capping historical records
  const [
    practiceSessions,
    mistakes,
    mockTopics,
  ] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
      select: {
        topic: true,
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
      },
    }),

    prisma.mockTopicPerformance.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
      select: {
        topic: true,
        accuracy: true,
      },
    }),
  ]);

  const topicMap = new Map<
    string,
    {
      accuracies: number[];
      qpms: number[];
      attempts: number;
    }
  >();

  practiceSessions.forEach((session) => {
    const existing =
      topicMap.get(session.topic) ?? {
        accuracies: [],
        qpms: [],
        attempts: 0,
      };

    existing.accuracies.push(
      session.accuracy
    );

    existing.qpms.push(
      session.qpm
    );

    existing.attempts++;

    topicMap.set(
      session.topic,
      existing
    );
  });

  const priorities: TopicPriority[] = [];

  topicMap.forEach(
    (data, topic) => {
      let score = 0;
      const reasons: string[] = [];

      const avgAccuracy =
        data.accuracies.reduce(
          (a, b) => a + b,
          0
        ) / data.accuracies.length;

      const avgQpm =
        data.qpms.reduce(
          (a, b) => a + b,
          0
        ) / data.qpms.length;

      //
      // Weightage
      //
      const weightage = getTopicWeightage(
        profile,
        topic
      );

      score += weightage;

      if (weightage >= 20) {
        reasons.push(
          "High exam weightage"
        );
      }

      //
      // Accuracy Penalty
      //
      if (avgAccuracy < 60) {
        score += 40;
        reasons.push(
          "Very low accuracy"
        );
      } else if (
        avgAccuracy < 70
      ) {
        score += 30;
        reasons.push(
          "Low accuracy"
        );
      } else if (
        avgAccuracy < 80
      ) {
        score += 20;
      } else if (
        avgAccuracy < 90
      ) {
        score += 10;
      }

      //
      // QPM Penalty
      //
      if (avgQpm < 0.8) {
        score += 40;
        reasons.push(
          "Very slow speed"
        );
      } else if (
        avgQpm < 1.1
      ) {
        score += 30;
        reasons.push(
          "Slow speed"
        );
      } else if (
        avgQpm < 1.4
      ) {
        score += 20;
      } else if (
        avgQpm < TARGET_QPM
      ) {
        score += 10;
      }

      //
      // Mistakes
      //
      const topicMistakes = mistakes.filter(
        (m) => m.topic === topic
      ).length;

      if (topicMistakes >= 5) {
        score += 30;
        reasons.push(
          "Many unresolved mistakes"
        );
      } else if (
        topicMistakes >= 3
      ) {
        score += 20;
      } else if (
        topicMistakes >= 1
      ) {
        score += 10;
      }

      //
      // Mock Weakness
      //
      const mockData = mockTopics.filter(
        (m) => m.topic === topic
      );

      if (
        mockData.length > 0
      ) {
        const mockAccuracy =
          mockData.reduce(
            (sum, m) => sum + m.accuracy,
            0
          ) / mockData.length;

        if (
          mockAccuracy < 70
        ) {
          score += 25;
          reasons.push(
            "Weak in mocks"
          );
        }
      }

      //
      // Confidence
      //
      if (
        data.attempts < 5
      ) {
        score += 10;
        reasons.push(
          "Limited practice data"
        );
      }

      //
      // Trend
      //
      if (
        data.accuracies.length >= 6
      ) {
        const recent =
          data.accuracies
            .slice(0, 3)
            .reduce(
              (a, b) => a + b,
              0
            ) / 3;

        const previous =
          data.accuracies
            .slice(3, 6)
            .reduce(
              (a, b) => a + b,
              0
            ) / 3;

        if (
          recent < previous
        ) {
          score += 15;
          reasons.push(
            "Performance declining"
          );
        }
      }

      const knowledgeScore = Math.round(
        avgAccuracy
      );

      const speedScore = Math.min(
        100,
        Math.round(
          (avgQpm / TARGET_QPM) * 100
        )
      );

      let priority: "HIGH" | "MEDIUM" | "LOW";

      if (score >= 80) {
        priority = "HIGH";
      } else if (
        score >= 50
      ) {
        priority = "MEDIUM";
      } else {
        priority = "LOW";
      }

      priorities.push({
        topic,
        score,
        priority,
        knowledgeScore,
        speedScore,
        reasons,
      });
    }
  );

  return priorities.sort(
    (a, b) => b.score - a.score
  );
}
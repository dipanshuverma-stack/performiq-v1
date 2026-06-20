import { MockType } from "@prisma/client";

export type MockAnalyticsInput = {
  score: number;
  accuracy: number;
  mockType: MockType | null;
  subjectPerformances: {
    subject: string;
    accuracy: number;
  }[];
};

export interface MockAnalytics {
  stats: {
    totalMocks: number;
    averageAccuracy: number;
    bestAccuracy: number;
    bestScore: number;
    averageScore: number;
    prelimsMocks: number;
    mainsMocks: number;
    performanceLevel: string;
    targetAccuracy: number;
    confidenceScore: number;
  };

  intelligence: {
    performanceLevel: string;
    confidenceScore: number;
    targetAccuracy: number;
    strongestSubject: {
      subject: string;
      accuracy: number;
    } | null;
    weakestSubject: {
      subject: string;
      accuracy: number;
    } | null;
    focusNext: string | null;
  };
}

export function buildMockAnalytics(
  mocks: MockAnalyticsInput[]
): MockAnalytics {
  const totalMocks = mocks.length;

  if (totalMocks === 0) {
    return {
      stats: {
        totalMocks: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        bestScore: 0,
        averageScore: 0,
        prelimsMocks: 0,
        mainsMocks: 0,
        performanceLevel: "Beginner",
        targetAccuracy: 0,
        confidenceScore: 0,
      },

      intelligence: {
        performanceLevel: "Beginner",
        confidenceScore: 0,
        targetAccuracy: 0,
        strongestSubject: null,
        weakestSubject: null,
        focusNext: null,
      },
    };
  }

  const summary = mocks.reduce(
    (acc, mock) => {
      acc.totalAccuracy += mock.accuracy;
      acc.totalScore += mock.score;

      acc.bestAccuracy = Math.max(
        acc.bestAccuracy,
        mock.accuracy
      );

      acc.bestScore = Math.max(
        acc.bestScore,
        mock.score
      );

      if (mock.mockType === MockType.PRELIMS) {
        acc.prelimsMocks++;
      }

      if (mock.mockType === MockType.MAINS) {
        acc.mainsMocks++;
      }

      return acc;
    },
    {
      totalAccuracy: 0,
      totalScore: 0,
      bestAccuracy: 0,
      bestScore: 0,
      prelimsMocks: 0,
      mainsMocks: 0,
    }
  );

  const averageAccuracy =
    summary.totalAccuracy / totalMocks;

  const averageScore =
    summary.totalScore / totalMocks;

  const performanceLevel =
    averageAccuracy >= 80
      ? "Advanced"
      : averageAccuracy >= 65
      ? "Intermediate"
      : "Beginner";

  const targetAccuracy = Math.min(
    90,
    Math.round(averageAccuracy + 5)
  );

  const confidenceScore = Math.min(
    100,
    Math.round(averageAccuracy * 1.1)
  );

  const subjectMap = new Map<
    string,
    {
      total: number;
      count: number;
    }
  >();

  for (const mock of mocks) {
    for (const subject of mock.subjectPerformances) {
      const existing = subjectMap.get(subject.subject);

      if (existing) {
        existing.total += subject.accuracy;
        existing.count++;
      } else {
        subjectMap.set(subject.subject, {
          total: subject.accuracy,
          count: 1,
        });
      }
    }
  }

  let strongestSubject: {
    subject: string;
    accuracy: number;
  } | null = null;

  let weakestSubject: {
    subject: string;
    accuracy: number;
  } | null = null;

  for (const [subject, data] of subjectMap.entries()) {
    const accuracy = data.total / data.count;

    if (
      !strongestSubject ||
      accuracy > strongestSubject.accuracy
    ) {
      strongestSubject = {
        subject,
        accuracy,
      };
    }

    if (
      !weakestSubject ||
      accuracy < weakestSubject.accuracy
    ) {
      weakestSubject = {
        subject,
        accuracy,
      };
    }
  }

  return {
    stats: {
      totalMocks,
      averageAccuracy,
      bestAccuracy: summary.bestAccuracy,
      bestScore: summary.bestScore,
      averageScore,
      prelimsMocks: summary.prelimsMocks,
      mainsMocks: summary.mainsMocks,
      performanceLevel,
      targetAccuracy,
      confidenceScore,
    },

    intelligence: {
      performanceLevel,
      confidenceScore,
      targetAccuracy,
      strongestSubject,
      weakestSubject,
      focusNext:
        weakestSubject?.subject ?? null,
    },
  };
}
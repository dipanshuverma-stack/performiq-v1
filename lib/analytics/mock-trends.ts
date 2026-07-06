import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface MockTrends {
  averageAccuracy: number;
  bestAccuracy: number;
  latestAccuracy: number;
  improvement: number;
}

const cachedGetMockTrends = cache(async (userId: string): Promise<MockTrends> => {
  const mocks = await prisma.mockTest.findMany({
    where: { userId },
    select: {
      accuracy: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (mocks.length === 0) {
    return {
      averageAccuracy: 0,
      bestAccuracy: 0,
      latestAccuracy: 0,
      improvement: 0,
    };
  }

  const accuracies = mocks.map((m) => m.accuracy ?? 0);

  const averageAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const bestAccuracy = Math.max(...accuracies);
  const latestAccuracy = accuracies[accuracies.length - 1];
  const firstAccuracy = accuracies[0];

  return {
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    bestAccuracy: Math.round(bestAccuracy * 10) / 10,
    latestAccuracy: Math.round(latestAccuracy * 10) / 10,
    improvement: Math.round((latestAccuracy - firstAccuracy) * 10) / 10,
  };
});

export async function getMockTrends(userId: string): Promise<MockTrends> {
  return cachedGetMockTrends(userId);
}
import { prisma } from "@/lib/prisma";

export async function getMockTrends(
  userId: string
) {
  const mocks =
    await prisma.mockTest.findMany({
      where: {
        userId,
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

  const accuracies = mocks.map(
    (m) => m.accuracy ?? 0
  );

  const averageAccuracy =
    accuracies.reduce(
      (a, b) => a + b,
      0
    ) / accuracies.length;

  const bestAccuracy =
    Math.max(...accuracies);

  const latestAccuracy =
    accuracies[
      accuracies.length - 1
    ];

  const firstAccuracy =
    accuracies[0];

  const improvement =
    latestAccuracy -
    firstAccuracy;

  return {
    averageAccuracy,
    bestAccuracy,
    latestAccuracy,
    improvement,
  };
}
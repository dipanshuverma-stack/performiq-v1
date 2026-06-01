import { prisma } from "@/lib/prisma";

export async function getMockTrends(
  userId: string
) {
  const mocks = await prisma.mockTest.findMany({
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
      mocks,
    };
  }

  const averageAccuracy =
    mocks.reduce(
      (sum, mock) => sum + mock.accuracy,
      0
    ) / mocks.length;

  const bestAccuracy = Math.max(
    ...mocks.map((mock) => mock.accuracy)
  );

  const latestAccuracy =
    mocks[mocks.length - 1].accuracy;

  const firstAccuracy =
    mocks[0].accuracy;

  const improvement =
    latestAccuracy - firstAccuracy;

  return {
    averageAccuracy,
    bestAccuracy,
    latestAccuracy,
    improvement,
    mocks,
  };
}
import { prisma } from "@/lib/prisma";
import { calculateRollingAverage } from "./rolling-average";

export async function getPracticeAccuracyTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        accuracy: true,
      },
    });

  const chronological = sessions.reverse();

  const rollingAccuracy = calculateRollingAverage(
    chronological.map((session) => session.accuracy),
    3
  );

  return chronological.map((_, index) => ({
    session: index + 1,
    accuracy: rollingAccuracy[index],
  }));
}

export async function getPracticeQpmTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        qpm: true,
      },
    });

  const chronological = sessions.reverse();

  const rollingQpm = calculateRollingAverage(
    chronological.map((session) => session.qpm),
    3
  );

  return chronological.map((_, index) => ({
    session: index + 1,
    qpm: rollingQpm[index],
  }));
}
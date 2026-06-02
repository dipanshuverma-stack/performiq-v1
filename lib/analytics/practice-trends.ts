import { prisma } from "@/lib/prisma";

export async function getPracticeAccuracyTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        accuracy: true,
      },
    });

  return sessions
    .reverse()
    .map((session, index) => ({
      session: index + 1,
      accuracy: session.accuracy,
    }));
}

export async function getPracticeQpmTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      select: {
        qpm: true,
      },
    });

  return sessions
    .reverse()
    .map((session, index) => ({
      session: index + 1,
      qpm: session.qpm,
    }));
}
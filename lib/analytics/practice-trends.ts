import { prisma } from "@/lib/prisma";

export async function getPracticeAccuracyTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        accuracy: true,
      },
    });

  return sessions.map(
    (session, index) => ({
      session: index + 1,
      accuracy: session.accuracy,
    })
  );
}

export async function getPracticeQpmTrend(
  userId: string
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        qpm: true,
      },
    });

  return sessions.map(
    (session, index) => ({
      session: index + 1,
      qpm: session.qpm,
    })
  );
}
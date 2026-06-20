import { prisma } from "@/lib/prisma";

export interface PracticeConsistency {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  totalDays: number;
  consistencyScore: number;
}

export async function getPracticeConsistency(
  userId: string
): Promise<PracticeConsistency> {
  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const uniqueDays = [
    ...new Set(
      sessions.map((s) =>
        s.createdAt.toISOString().split("T")[0]
      )
    ),
  ];

  if (uniqueDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      totalDays: 0,
      consistencyScore: 0,
    };
  }

  const dates = uniqueDays
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff =
      (dates[i].getTime() - dates[i - 1].getTime()) /
      86400000;

    if (diff === 1) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 1;
    }
  }

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daySet = new Set(uniqueDays);

  while (true) {
    const key = today.toISOString().split("T")[0];

    if (!daySet.has(key)) break;

    currentStreak++;

    today.setDate(today.getDate() - 1);
  }

  const first = dates[0];
  const last = dates[dates.length - 1];

  const totalDays =
    Math.floor(
      (last.getTime() - first.getTime()) / 86400000
    ) + 1;

  const consistencyScore = Math.round(
    (uniqueDays.length / totalDays) * 100
  );

  return {
    currentStreak,
    longestStreak: longest,
    activeDays: uniqueDays.length,
    totalDays,
    consistencyScore,
  };
}
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { calculateRollingAverage } from "./rolling-average";

async function getPracticeAccuracyTrendInternal(userId: string) {
  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    select: { accuracy: true },
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  if (sessions.length === 0) return [];

  const accuracies = sessions.map((s) => s.accuracy ?? 0);
  const rollingAccuracy = calculateRollingAverage(accuracies, 3);

  return rollingAccuracy.map((accuracy, index) => ({
    session: index + 1,
    accuracy: Math.round(accuracy * 10) / 10,
  }));
}

async function getPracticeQpmTrendInternal(userId: string) {
  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    select: { qpm: true },
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  if (sessions.length === 0) return [];

  const qpms = sessions.map((s) => s.qpm ?? 0);
  const rollingQpm = calculateRollingAverage(qpms, 3);

  return rollingQpm.map((qpm, index) => ({
    session: index + 1,
    qpm: Math.round(qpm * 100) / 100,
  }));
}

// Exported cached versions
export const getPracticeAccuracyTrend = cache(getPracticeAccuracyTrendInternal);
export const getPracticeQpmTrend = cache(getPracticeQpmTrendInternal);
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getPlannerToday } from "../planner/planner-date";

export interface PracticeConsistency {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  totalDays: number;
  consistencyScore: number;
}

const cachedGetPracticeConsistency = cache(async (userId: string): Promise<PracticeConsistency> => {
  // Get only necessary data - sorted by date
  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      totalDays: 0,
      consistencyScore: 0,
    };
  }

  // Extract unique dates
  const uniqueDates = [...new Set(
    sessions.map(s => s.createdAt.toISOString().split("T")[0])
  )].sort();

  const dates = uniqueDates.map(d => new Date(d));

  // Calculate streaks
  let currentRun = 1;
  let longestStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i].getTime() - dates[i - 1].getTime()) / 86400000;
    if (diff === 1) {
      currentRun++;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 1;
    }
  }

  // Calculate current streak (from today backwards)
  let currentStreak = 0;
  const today = getPlannerToday();
  const daySet = new Set(uniqueDates);

  while (true) {
    const key = today.toISOString().split("T")[0];
    if (!daySet.has(key)) break;
    currentStreak++;
    today.setDate(today.getDate() - 1);
  }

  // Total span
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const totalDays = Math.floor(
    (lastDate.getTime() - firstDate.getTime()) / 86400000
  ) + 1;

  const consistencyScore = Math.round((uniqueDates.length / totalDays) * 100);

  return {
    currentStreak,
    longestStreak,
    activeDays: uniqueDates.length,
    totalDays,
    consistencyScore: Math.min(100, consistencyScore),
  };
});

export async function getPracticeConsistency(userId: string): Promise<PracticeConsistency> {
  return cachedGetPracticeConsistency(userId);
}
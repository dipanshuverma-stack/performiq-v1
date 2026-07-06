import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface WeeklyTrendDay {
  day: string;
  minutes: number;
}

const cachedGetWeeklyStudyTrend = cache(async (userId: string): Promise<WeeklyTrendDay[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      duration: true,
      createdAt: true,
    },
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendMap = daysOfWeek.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {} as Record<string, number>);

  sessions.forEach((session) => {
    const dayIndex = new Date(session.createdAt).getDay();
    const dayName = daysOfWeek[dayIndex];
    trendMap[dayName] += session.duration ?? 0;
  });

  return daysOfWeek.map((day) => ({
    day,
    minutes: Math.round(trendMap[day] / 60), // Convert seconds to minutes if needed
  }));
});

export async function getWeeklyStudyTrend(userId: string): Promise<WeeklyTrendDay[]> {
  return cachedGetWeeklyStudyTrend(userId);
}
// lib/analytics/study-trend.ts
import { prisma } from "@/lib/prisma";

export interface WeeklyTrendDay {
  day: string; // "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
  minutes: number;
}

export async function getWeeklyStudyTrend(userId: string): Promise<WeeklyTrendDay[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
    const dayName = daysOfWeek[new Date(session.createdAt).getDay()];
    if (dayName in trendMap) {
      trendMap[dayName] += session.duration;
    }
  });

  return daysOfWeek.map((day) => ({
    day,
    minutes: trendMap[day],
  }));
}
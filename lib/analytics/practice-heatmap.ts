import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface HeatmapDay {
  date: string;
  sessions: number;
  questions: number;
  durationSeconds: number;
}

const cachedGetPracticeHeatmap = cache(async (userId: string): Promise<HeatmapDay[]> => {
  const grouped = await prisma.practiceSession.groupBy({
    by: ["createdAt"], // Group by date (we'll truncate in JS if needed)
    where: { userId },
    _count: { id: true },
    _sum: {
      totalQuestions: true,
      durationSeconds: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return grouped.map((group) => {
    const date = group.createdAt.toISOString().split("T")[0];

    return {
      date,
      sessions: group._count.id,
      questions: group._sum.totalQuestions ?? 0,
      durationSeconds: group._sum.durationSeconds ?? 0,
    };
  });
});

export async function getPracticeHeatmap(userId: string): Promise<HeatmapDay[]> {
  return cachedGetPracticeHeatmap(userId);
}
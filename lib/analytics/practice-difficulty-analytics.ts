import { prisma } from "@/lib/prisma";
import { Difficulty } from "@prisma/client";

export interface DifficultyPerformance {
  difficulty: Difficulty;

  sessions: number;

  accuracy: number;

  qpm: number;

  totalQuestions: number;

  totalHours: number;
}

export async function getPracticeDifficultyAnalytics(
  userId: string
): Promise<DifficultyPerformance[]> {
  const results =
    await prisma.practiceSession.groupBy({
      by: ["difficulty"],

      where: {
        userId,
        difficulty: {
          not: null,
        },
      },

      _count: {
        id: true,
      },

      _avg: {
        accuracy: true,
        qpm: true,
      },

      _sum: {
        totalQuestions: true,
        durationSeconds: true,
      },
    });

  return results.map((item) => ({
    difficulty: item.difficulty!,

    sessions: item._count.id,

    accuracy:
      Math.round((item._avg.accuracy ?? 0) * 10) / 10,

    qpm:
      Math.round((item._avg.qpm ?? 0) * 100) / 100,

    totalQuestions:
      item._sum.totalQuestions ?? 0,

    totalHours:
      Math.round(
        ((item._sum.durationSeconds ?? 0) / 3600) * 10
      ) / 10,
  }));
}
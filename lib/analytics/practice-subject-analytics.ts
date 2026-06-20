
import { prisma } from "@/lib/prisma";
import { Subject } from "@prisma/client";

export interface SubjectPerformance {
  subject: Subject;
  accuracy: number;
  qpm: number;
  sessions: number;
  totalQuestions: number;
  totalHours: number;
}

export async function getPracticeSubjectAnalytics(
  userId: string
): Promise<SubjectPerformance[]> {
  const results = await prisma.practiceSession.groupBy({
    by: ["subject"],

    where: {
      userId,
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

  return results
    .map((item) => ({
      subject: item.subject,

      accuracy:
        Math.round((item._avg.accuracy ?? 0) * 10) / 10,

      qpm:
        Math.round((item._avg.qpm ?? 0) * 100) / 100,

      sessions:
        item._count.id,

      totalQuestions:
        item._sum.totalQuestions ?? 0,

      totalHours:
        Math.round(
          ((item._sum.durationSeconds ?? 0) / 3600) * 10
        ) / 10,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
}


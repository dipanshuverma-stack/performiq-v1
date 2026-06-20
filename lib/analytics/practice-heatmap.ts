import { prisma } from "@/lib/prisma";

export interface HeatmapDay {
  date: string;
  sessions: number;
  questions: number;
  durationSeconds: number;
}

export async function getPracticeHeatmap(
  userId: string
): Promise<HeatmapDay[]> {
  const sessions = await prisma.practiceSession.findMany({
    where: {
      userId,
    },

    select: {
      createdAt: true,
      totalQuestions: true,
      durationSeconds: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  const map = new Map<string, HeatmapDay>();

  for (const session of sessions) {
    const date = session.createdAt
      .toISOString()
      .split("T")[0];

    const existing = map.get(date);

    if (existing) {
      existing.sessions += 1;
      existing.questions += session.totalQuestions;
      existing.durationSeconds += session.durationSeconds;
    } else {
      map.set(date, {
        date,
        sessions: 1,
        questions: session.totalQuestions,
        durationSeconds: session.durationSeconds,
      });
    }
  }

  return [...map.values()];
}
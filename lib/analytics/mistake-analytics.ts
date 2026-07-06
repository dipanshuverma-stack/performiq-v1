import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface MistakeAnalytics {
  totalMistakes: number;
  resolved: number;
  pending: number;
  resolutionRate: string;
  topWeakSubject: string;
  subjectBreakdown: Record<string, number>;
}

const cachedGetMistakeAnalytics = cache(async (userId: string): Promise<MistakeAnalytics> => {
  const [totalMistakes, resolvedCount, subjectGroups] = await Promise.all([
    prisma.mistakeEntry.count({ where: { userId } }),
    prisma.mistakeEntry.count({ where: { userId, resolved: true } }),
    prisma.mistakeEntry.groupBy({
      by: ["subject"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  const pending = totalMistakes - resolvedCount;
  const resolutionRate = totalMistakes > 0
    ? ((resolvedCount / totalMistakes) * 100).toFixed(1)
    : "0";

  const topWeakSubject = subjectGroups[0]?.subject ?? "-";

  const subjectBreakdown = Object.fromEntries(
    subjectGroups.map((item) => [item.subject, item._count.id])
  );

  return {
    totalMistakes,
    resolved: resolvedCount,
    pending,
    resolutionRate,
    topWeakSubject,
    subjectBreakdown,
  };
});

export async function getMistakeAnalytics(userId: string): Promise<MistakeAnalytics> {
  return cachedGetMistakeAnalytics(userId);
}
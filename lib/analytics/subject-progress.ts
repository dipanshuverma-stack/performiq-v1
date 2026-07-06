import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface SubjectProgress {
  subject: string;
  total: number;
  completed: number;
  percentage: number;
}

const cachedGetSubjectProgress = cache(async (userId: string): Promise<SubjectProgress[]> => {
  const grouped = await prisma.topicProgress.groupBy({
    by: ["subject"],
    where: { userId },
    _count: { id: true },
    // Use _sum only if you have a numeric field. Otherwise use separate count for completed
  });

  // Separate query for completed count (more reliable)
  const completedGrouped = await prisma.topicProgress.groupBy({
    by: ["subject"],
    where: { userId, completed: true },
    _count: { id: true },
  });

  const completedMap = new Map(
    completedGrouped.map(item => [item.subject, item._count.id])
  );

  return grouped.map((item) => {
    const total = item._count.id;
    const completed = completedMap.get(item.subject) ?? 0;

    return {
      subject: item.subject,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
});

export async function getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
  return cachedGetSubjectProgress(userId);
}
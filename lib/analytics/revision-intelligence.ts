import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface RevisionIntelligence {
  total: number;
  dueToday: number;
  overdue: number;
  upcoming: any[]; // You can refine this type if needed
}

const cachedGetRevisionIntelligence = cache(async (userId: string): Promise<RevisionIntelligence> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const revisions = await prisma.revision.findMany({
    where: { userId },
    orderBy: { nextRevision: "asc" },
    take: 20, // Limit to avoid loading too many records
  });

  const dueToday = revisions.filter((r) => {
    const nextDate = new Date(r.nextRevision);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate.getTime() === today.getTime();
  }).length;

  const overdue = revisions.filter((r) => {
    const nextDate = new Date(r.nextRevision);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate < today;
  }).length;

  return {
    total: revisions.length,
    dueToday,
    overdue,
    upcoming: revisions.slice(0, 10),
  };
});

export async function getRevisionIntelligence(userId: string) {
  return cachedGetRevisionIntelligence(userId);
}
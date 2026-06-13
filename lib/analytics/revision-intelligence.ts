import { prisma } from "@/lib/prisma";

export async function getRevisionIntelligence(
  userId: string
) {
  const revisions =
    await prisma.revision.findMany({
      where: {
        userId,
      },
      orderBy: {
        nextRevision: "asc",
      },
    });

  const today = new Date();

  return {
    total: revisions.length,

    dueToday: revisions.filter(
      (r) => r.nextRevision <= today
    ).length,

    overdue: revisions.filter(
      (r) => r.nextRevision < today
    ).length,

    upcoming: revisions.slice(0, 10),
  };
}
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVISION_INTERVALS: Record<number, number> = {
  0: 3,
  1: 7,
  2: 15,
  3: 30,
};

export async function completeRevision(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const revision = await prisma.revision.findFirst({
    where: { 
      id, 
      user: { email: session.user.email } 
    },
  });

  if (!revision) {
    throw new Error("Revision task not found or unauthorized");
  }

  // Calculate next revision date
  const daysToAdd = REVISION_INTERVALS[revision.revisionCount] ?? 30;
  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + daysToAdd);

  await prisma.revision.update({
    where: { id },
    data: {
      revisionCount: { increment: 1 },
      nextRevision: nextRevisionDate,
    },
  });

  // Check overdue revisions and send notification if 2 or more
  const overdueCount = await prisma.revision.count({
    where: {
      user: { email: session.user.email },
      nextRevision: { lt: new Date() },
    },
  });

  if (overdueCount >= 2) {
    await prisma.notification.create({
      data: {
        userId: revision.userId,
        title: "Revision Overdue Alert",
        message: `${overdueCount} revisions are overdue. Complete them today to maintain progress.`,
      },
    });
  }

  revalidatePath("/revision");
  revalidatePath("/dashboard");
}
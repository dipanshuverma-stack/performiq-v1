"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Map revision counts to day intervals for better maintainability
const REVISION_INTERVALS: Record<number, number> = {
  0: 3,
  1: 7,
  2: 15,
  3: 30,
};

export async function completeRevision(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  // 1. Fetch revision and verify ownership in one query
  const revision = await prisma.revision.findFirst({
    where: { 
      id, 
      user: { email: session.user.email } 
    },
  });

  if (!revision) {
    throw new Error("Revision task not found or unauthorized");
  }

  // 2. Calculate next date using the mapping
  const daysToAdd = REVISION_INTERVALS[revision.revisionCount] ?? 30;
  
  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + daysToAdd);

  // 3. Perform update
  await prisma.revision.update({
    where: { id },
    data: {
      revisionCount: { increment: 1 },
      nextRevision: nextRevisionDate,
    },
  });

  revalidatePath("/revision");
  revalidatePath("/dashboard");
}
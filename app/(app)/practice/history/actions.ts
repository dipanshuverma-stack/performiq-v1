"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates notes for a practice session with proper ownership check.
 */
export async function updatePracticeSessionNotes(sessionId: string, notes: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // Single query with ownership verification
  const updated = await prisma.practiceSession.update({
    where: {
      id: sessionId,
      userId: session.user.id, // Use session.user.id if available (faster)
    },
    data: { notes },
    select: { id: true },
  });

  if (!updated) {
    throw new Error("Practice session not found or access denied");
  }

  // Revalidate relevant pages
  revalidatePath("/practice/history");
  revalidatePath("/practice/analytics");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Safely deletes a practice session with ownership verification.
 */
export async function deletePracticeSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id; // Prefer direct ID from session

  const reward = await prisma.rewardLog.findFirst({
    where: {
      userId,
      sourceId: sessionId,
    },
    select: {
      id: true,
      points: true,
    },
  });

  // Atomic delete with ownership check (most efficient)
  await prisma.$transaction(async (tx) => {
  // Remove reward if it exists
  if (reward) {
    await tx.rewardLog.delete({
      where: {
        id: reward.id,
      },
    });

    await tx.rewardSummary.update({
      where: {
        userId,
      },
      data: {
        totalPoints: {
          decrement: reward.points,
        },
        weeklyPoints: {
          decrement: reward.points,
        },
        monthlyPoints: {
          decrement: reward.points,
        },
      },
    });
  }

  // Delete the practice session
  const deleted = await tx.practiceSession.deleteMany({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (deleted.count === 0) {
    throw new Error("Practice session not found or access denied");
  }
});

  // Revalidate pages
  revalidatePath("/practice/history");
  revalidatePath("/practice/analytics");
  revalidatePath("/dashboard");

  return { success: true };
}
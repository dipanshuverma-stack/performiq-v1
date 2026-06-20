"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates the notes associated with an existing practice session.
 */
export async function updatePracticeSessionNotes(
  sessionId: string,
  notes: string
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.practiceSession.update({
    where: {
      id: sessionId,
      userId: user.id,
    },
    data: {
      notes,
    },
  });

  revalidatePath("/practice/history");
  revalidatePath("/practice/analytics");
  revalidatePath("/dashboard");
}

/**
 * Safely deletes a specific practice session after running multi-tenant ownership checks.
 * Triggers layout revalidation to refresh analytics across the dashboard.
 */
export async function deletePracticeSession(
  sessionId: string
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // ✅ Pre-flight verification: Ensure session exists and belongs to the user
  const practiceSession =
    await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

  if (!practiceSession) {
    throw new Error("Practice session not found");
  }

  await prisma.practiceSession.delete({
    where: {
      id: practiceSession.id,
    },
  });

  revalidatePath("/practice/history");
  revalidatePath("/practice/analytics");
  revalidatePath("/dashboard");
}
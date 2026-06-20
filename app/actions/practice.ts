"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { REVISION_STATUS } from "@/lib/constants/practice";
import { PracticeSessionSchema } from "@/lib/validations/practice";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function savePracticeSession(rawInput: unknown) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized access context" };
  }

  const payload = rawInput instanceof FormData 
    ? Object.fromEntries(rawInput.entries()) 
    : rawInput;

  const validationResult = PracticeSessionSchema.safeParse(payload);
  if (!validationResult.success) {
    return { 
      success: false, 
      error: "Validation failure", 
      details: validationResult.error.format() 
    };
  }

  const { 
    subject, 
    topic, 
    totalQuestions, 
    correctQuestions, 
    durationSeconds, 
    difficulty, 
    notes,
    confidenceScore,
    revisionStatus 
  } = validationResult.data;

  const incorrectQuestions = Math.max(0, totalQuestions - correctQuestions);
  
  const accuracy = totalQuestions > 0 
    ? Number(((correctQuestions / totalQuestions) * 100).toFixed(2)) 
    : 0;
    
  const qpm = durationSeconds > 0 
    ? Number((totalQuestions / (durationSeconds / 60)).toFixed(2)) 
    : 0;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User context matching record not found" };
    }

    const recordedSession = await prisma.practiceSession.create({
      data: {
        sessionUuid: randomUUID(),
        userId: user.id,
        subject,
        topic,
        difficulty,
        totalQuestions,
        correctQuestions,
        incorrectQuestions,
        durationSeconds,
        accuracy,
        qpm,
        mistakeCount: incorrectQuestions, 
        revisionStatus: revisionStatus ?? REVISION_STATUS.UNRESOLVED,
        confidenceScore,
        notes: notes?.trim() || undefined,
      },
    });

    revalidatePath("/practice");
    revalidatePath("/practice/history");
    revalidatePath("/practice/analytics");

    return { success: true, data: recordedSession };
  } catch (error) {
    console.error("[CRITICAL_SAVE_SESSION_FAILURE]:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        error: "Duplicate session detected.",
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected database error occurred" 
    };
  }
}

export async function deletePracticeSession(id: string) {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      error: "Unauthorized",
    };
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
    return {
      success: false,
      error: "User not found",
    };
  }

  await prisma.practiceSession.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/practice");

  return {
    success: true,
  };
}
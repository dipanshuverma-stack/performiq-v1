"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RevisionStatus } from "@prisma/client";
import { PracticeSessionSchema } from "@/lib/validations/practice";
import { evaluatePracticeReward } from "@/lib/rewards/practice";
import { randomUUID } from "crypto";

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
  const accuracy = totalQuestions > 0 ? Number(((correctQuestions / totalQuestions) * 100).toFixed(2)) : 0;
  const qpm = durationSeconds > 0 ? Number((totalQuestions / (durationSeconds / 60)).toFixed(2)) : 0;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User context matching record not found" };
    }

    const recordedSession = await prisma.$transaction(async (tx) => {
      // 1. Create the Practice Session
      const sessionRecord = await tx.practiceSession.create({
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
          revisionStatus: revisionStatus ?? RevisionStatus.UNRESOLVED,
          confidenceScore,
          notes: notes?.trim() || undefined,
        },
      });

      // 2. Retrieve existing topic progress
      const existingTopic = await tx.topicProgress.findUnique({
        where: {
          userId_subject_topicName: {
            userId: user.id,
            subject,
            topicName: topic,
          },
        },
      });

      // 3. Create or Update TopicProgress
      if (!existingTopic) {
        await tx.topicProgress.create({
          data: {
            userId: user.id,
            subject,
            topicName: topic,
            completed: false,
            practiceSessions: 1,
            practiceQuestions: totalQuestions,
            practiceAccuracy: accuracy,
            revisionCount: 0,
            mockQuestions: 0,
            mockAccuracy: 0,
            mistakeCount: incorrectQuestions,
            lastPracticedAt: new Date(),
            lastStudiedAt: new Date(),
            confidence: confidenceScore ?? 0,
          },
        });
      } else {
        const previousCorrect =
          (existingTopic.practiceQuestions * existingTopic.practiceAccuracy) / 100;

        const updatedPracticeQuestions =
          existingTopic.practiceQuestions + totalQuestions;

        const updatedCorrectQuestions =
          previousCorrect + correctQuestions;

        const updatedPracticeAccuracy =
          updatedPracticeQuestions > 0
            ? Number(
                ((updatedCorrectQuestions / updatedPracticeQuestions) * 100).toFixed(2)
              )
            : 0;

        await tx.topicProgress.update({
          where: { id: existingTopic.id },
          data: {
            practiceSessions: { increment: 1 },
            practiceQuestions: { increment: totalQuestions },
            practiceAccuracy: updatedPracticeAccuracy,
            mistakeCount: { increment: incorrectQuestions },
            lastPracticedAt: new Date(),
            lastStudiedAt: new Date(),
          },
        });
      }

      return sessionRecord;
    });

    // Award daily practice milestone after database consistency is validated
    await evaluatePracticeReward(user.id);

    revalidatePath("/practice");
    revalidatePath("/practice/history");
    revalidatePath("/practice/analytics");

    return { success: true, data: recordedSession };
  } catch (error) {
    console.error("[CRITICAL_SAVE_SESSION_FAILURE]:", error);

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected database error occurred" 
    };
  }
}

export async function deletePracticeSession(id: string) {
  // ... (delete logic remains unchanged)
}
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RevisionStatus, RewardAction, RewardType } from "@prisma/client";
import { PracticeSessionSchema } from "@/lib/validations/practice";
import { getPracticeRewardPoints } from "@/lib/rewards/practice";
import { addReward } from "@/lib/rewards/reward-log";
import { updateStreak } from "@/lib/rewards/streak";
import { evaluateAchievementEvent } from "@/lib/achievements/evaluator";
import { randomUUID } from "crypto";

export async function savePracticeSession(rawInput: unknown) {
  const start = performance.now();

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

    console.time("Practice Transaction");
    const recordedSession = await prisma.$transaction(async (tx) => {
      // 1. Create the Practice Session
      console.time("practiceSession.create");
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
      console.timeEnd("practiceSession.create");

      // 2. Atomic Upsert for Topic Progress
      console.time("topicProgress.upsert");
      await tx.topicProgress.upsert({
        where: {
          userId_subject_topicName: {
            userId: user.id,
            subject,
            topicName: topic,
          },
        },
        create: {
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
        update: {
          practiceSessions: {
            increment: 1,
          },
          practiceQuestions: {
            increment: totalQuestions,
          },
          mistakeCount: {
            increment: incorrectQuestions,
          },
          lastPracticedAt: new Date(),
          lastStudiedAt: new Date(),
        },
      });
      console.timeEnd("topicProgress.upsert");

      return sessionRecord;
    });
    console.timeEnd("Practice Transaction");

    const rewardPoints = getPracticeRewardPoints(durationSeconds);
    if (rewardPoints > 0) {
      console.time("Reward");

      await addReward(
        user.id,
        RewardType.PRACTICE,
        RewardAction.EARN,
        rewardPoints,
        `${Math.round(durationSeconds / 60)} Minute Practice`,
        topic,
        recordedSession.id
      );

      await updateStreak(user.id);

      console.timeEnd("Reward");
    }

    // Evaluate dynamic achievement checks for this user context
    await evaluateAchievementEvent(user.id, "practice_completed");

    console.time("Revalidate");
    revalidatePath("/practice");
    revalidatePath("/practice/history");
    revalidatePath("/practice/analytics");
    console.timeEnd("Revalidate");

    console.log(
      "Total:",
      Math.round(performance.now() - start),
      "ms"
    );

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
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized access context" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User record matching context not found" };
    }

    const targetSession = await prisma.practiceSession.findUnique({
      where: { id },
    });

    if (!targetSession || targetSession.userId !== user.id) {
      return { success: false, error: "Session non-existent or data block ownership mismatch" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete the targeted base session record
      await tx.practiceSession.delete({
        where: { id },
      });

      // 2. Fetch the updated state of remaining sessions under this exact topic block
      const remainingSessions = await tx.practiceSession.findMany({
        where: {
          userId: user.id,
          subject: targetSession.subject,
          topic: targetSession.topic,
        },
      });

      if (remainingSessions.length === 0) {
        await tx.topicProgress.update({
          where: {
            userId_subject_topicName: {
              userId: user.id,
              subject: targetSession.subject,
              topicName: targetSession.topic,
            },
          },
          data: {
            practiceSessions: 0,
            practiceQuestions: 0,
            practiceAccuracy: 0,
            mistakeCount: { decrement: targetSession.incorrectQuestions },
          },
        });
      } else {
        const totalQuestions = remainingSessions.reduce((acc, cur) => acc + cur.totalQuestions, 0);
        const totalCorrect = remainingSessions.reduce((acc, cur) => acc + cur.correctQuestions, 0);
        const recalculatedAccuracy = totalQuestions > 0 
          ? Number(((totalCorrect / totalQuestions) * 100).toFixed(2)) 
          : 0;

        await tx.topicProgress.update({
          where: {
            userId_subject_topicName: {
              userId: user.id,
              subject: targetSession.subject,
              topicName: targetSession.topic,
            },
          },
          data: {
            practiceSessions: remainingSessions.length,
            practiceQuestions: totalQuestions,
            practiceAccuracy: recalculatedAccuracy,
            mistakeCount: { decrement: targetSession.incorrectQuestions },
          },
        });
      }

      // 3. Process Point Reversion if an associated log matching this session is discovered
      const linkedRewardLog = await tx.rewardLog.findFirst({
        where: {
          userId: user.id,
          sourceId: id,
        },
      });

      if (linkedRewardLog) {
        await tx.rewardSummary.update({
          where: { userId: user.id },
          data: {
            totalPoints: { decrement: linkedRewardLog.points },
            weeklyPoints: { decrement: linkedRewardLog.points },
            monthlyPoints: { decrement: linkedRewardLog.points },
          },
        });

        await tx.rewardLog.delete({
          where: { id: linkedRewardLog.id },
        });
      }
    });

    revalidatePath("/practice");
    revalidatePath("/practice/history");
    revalidatePath("/practice/analytics");

    return { success: true };
  } catch (error) {
    console.error("[CRITICAL_DELETE_SESSION_FAILURE]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected processing error has dropped your query",
    };
  }
}
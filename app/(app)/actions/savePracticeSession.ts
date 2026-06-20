"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculatePracticeMetrics } from "@/lib/practice/metrics";
import { createPracticeSession } from "@/services/practice.service";
import {
  QuestionAttempt,
  PracticePhase,
  SessionSnapshot,
} from "@/lib/practice/types";
import { Subject, Difficulty } from "@prisma/client";

interface SavePracticeSessionPayload {
  attempts: QuestionAttempt[];
  elapsedMs: number;
  sessionUuid: string;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  notes?: string;
}

export async function savePracticeSession(payload: SavePracticeSessionPayload) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const metrics = calculatePracticeMetrics(payload.attempts, payload.elapsedMs);

  const practiceSession = await createPracticeSession({
    userId: user.id,
    sessionUuid: payload.sessionUuid,
    subject: payload.subject,
    topic: payload.topic,
    difficulty: payload.difficulty,
    totalQuestions: metrics.total,
    correctQuestions: metrics.correct,
    incorrectQuestions: metrics.wrong,
    accuracy: metrics.accuracy, 
    qpm: metrics.pace,          
    durationSeconds: metrics.durationSeconds,
    notes: payload.notes,
  });

  return {
    success: true,
    sessionId: practiceSession.id,
  };
}
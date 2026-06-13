import { prisma } from "@/lib/prisma";
import { Subject, Difficulty } from "@prisma/client";

interface SavePracticeSessionInput {
  userId: string;
  sessionUuid: string;
  subject: Subject;
  topic: string;
  difficulty?: Difficulty;
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  durationSeconds: number;
  accuracy: number;
  qpm: number;
  mistakeCount?: number;
  confidenceScore?: number;
  notes?: string;
}

export async function createPracticeSession(data: SavePracticeSessionInput) {
  return prisma.practiceSession.create({
    data: {
      sessionUuid: data.sessionUuid,
      userId: data.userId,
      // ✅ Fixed: Redundant, missing helper wrappers removed 
      subject: data.subject,
      topic: data.topic,
      difficulty: data.difficulty,
      totalQuestions: data.totalQuestions,
      correctQuestions: data.correctQuestions,
      incorrectQuestions: data.incorrectQuestions,
      durationSeconds: data.durationSeconds,
      accuracy: data.accuracy,
      qpm: data.qpm,
      mistakeCount: data.mistakeCount ?? 0,
      confidenceScore: data.confidenceScore,
      notes: data.notes,
    },
  });
}
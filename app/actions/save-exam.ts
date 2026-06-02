"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function saveExam(
  data: {
    examName: string;

    attempted: number;
    correct: number;
    wrong: number;

    accuracy: number;
    qpm: number;
    score: number;

    durationSeconds: number;
  }
) {
  const session =
    await auth();

  if (!session?.user?.email)
    return;

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
    });

  if (!user) return;

  await prisma.examSimulation.create({
    data: {
      userId: user.id,

      examName:
        data.examName,

      attempted:
        data.attempted,

      totalQuestions:
        data.attempted,

      correct:
        data.correct,

      wrong:
        data.wrong,

      accuracy:
        data.accuracy,

      qpm: data.qpm,

      score:
        data.score,

      durationSeconds:
        data.durationSeconds,
    },
  });
}
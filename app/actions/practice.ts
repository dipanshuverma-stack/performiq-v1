"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePracticeSession(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const subject =
    formData.get("subject") as string;

  const topic =
    formData.get("topic") as string;

  const totalQuestions = Number(
    formData.get("totalQuestions")
  );

  const correctQuestions = Number(
    formData.get("correctQuestions")
  );

  const durationSeconds = Number(
    formData.get("durationSeconds")
  );

  const incorrectQuestions =
    totalQuestions - correctQuestions;

  const accuracy =
    totalQuestions > 0
      ? (correctQuestions /
          totalQuestions) *
        100
      : 0;

  const qpm =
    durationSeconds > 0
      ? totalQuestions /
        (durationSeconds / 60)
      : 0;

  await prisma.practiceSession.create({
    data: {
      userId: user.id,

      subject,
      topic,

      totalQuestions,
      correctQuestions,
      incorrectQuestions,

      durationSeconds,

      accuracy,
      qpm,
    },
  });

  revalidatePath("/practice");
}
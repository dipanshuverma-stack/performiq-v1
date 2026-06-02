"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PracticeSessionSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  totalQuestions: z.coerce.number().min(0),
  correctQuestions: z.coerce.number().min(0),
  durationSeconds: z.coerce.number().min(0),
});

/**
 * Helper to fetch the user ID efficiently
 */
async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");
  return user.id;
}

export async function savePracticeSession(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validation = PracticeSessionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validation.success) {
    throw new Error("Invalid practice session data");
  }

  const { subject, topic, totalQuestions, correctQuestions, durationSeconds } = validation.data;

  const incorrectQuestions = totalQuestions - correctQuestions;
  const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
  const qpm = durationSeconds > 0 ? totalQuestions / (durationSeconds / 60) : 0;

  await prisma.practiceSession.create({
    data: {
      userId,
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
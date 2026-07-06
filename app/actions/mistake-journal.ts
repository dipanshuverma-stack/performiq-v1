"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Subject } from "@prisma/client";

const CreateMistakeSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  question: z.string().min(1, "Question is required"),
  explanation: z.string().optional(),
  source: z.string().optional(),
});

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

export async function createMistake(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validation = CreateMistakeSchema.safeParse({
    subject: formData.get("subject"),
    topic: formData.get("topic"),
    question: formData.get("question"),
    explanation: formData.get("explanation"),
    source: formData.get("source"),
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const { subject, topic, question, explanation, source } = validation.data;

  await prisma.mistakeEntry.create({
    data: {
      userId,
      subject: subject as Subject,
      topic,
      question,
      explanation,
      source,
    },
  });

  revalidatePath("/mistakes");
}

export async function resolveMistake(mistakeId: string) {
  const userId = await getAuthenticatedUserId();

  const mistake = await prisma.mistakeEntry.findFirst({
    where: { id: mistakeId, userId },
  });

  if (!mistake) {
    throw new Error("Mistake entry not found or access denied");
  }

  await prisma.mistakeEntry.update({
    where: { id: mistakeId },
    data: { resolved: true },
  });

  revalidatePath("/mistakes");
}
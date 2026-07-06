"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Subject } from "@prisma/client";

const StudySessionSchema = z.object({
  subject: z.nativeEnum(Subject),
  topic: z.string().min(1),
  duration: z.coerce.number().min(1),
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

export async function startStudySession(subject: Subject, topic: string, duration: number) {
  const userId = await getAuthenticatedUserId();

  const validation = StudySessionSchema.safeParse({ subject, topic, duration });
  if (!validation.success) throw new Error("Invalid session data");

  // Prevent duplicate active sessions for the same topic
  const existing = await prisma.studySession.findFirst({
    where: {
      userId,
      subject,
      topic,
      completed: false,
    },
  });

  if (existing) return;

  await prisma.studySession.create({
    data: {
      userId,
      subject,
      topic,
      duration,
      completed: false,
    },
  });
}
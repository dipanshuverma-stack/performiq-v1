"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function startStudySession(
  subject: string,
  topic: string,
  duration: number
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

  const existing = await prisma.studySession.findFirst({
    where: {
      userId: user.id,
      subject,
      topic,
      completed: false,
    },
  });

  if (existing) {
    return;
  }

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subject,
      topic,
      duration,
      completed: false,
    },
  });
}
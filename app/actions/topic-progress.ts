"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function completeTopic(topicName: string) {
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

  const existing = await prisma.topicProgress.findFirst({
    where: {
      userId: user.id,
      topicName,
    },
  });

  if (existing) {
    return;
  }

  await prisma.topicProgress.create({
    data: {
      userId: user.id,
      topicName,
      completed: true,
    },
  });
}
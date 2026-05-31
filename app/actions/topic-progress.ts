"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  const existingTopic = await prisma.topicProgress.findFirst({
    where: {
      userId: user.id,
      topicName,
    },
  });

  // Create topic progress only if it doesn't exist
  if (!existingTopic) {
    await prisma.topicProgress.create({
      data: {
        userId: user.id,
        topicName,
        completed: true,
      },
    });
  }

  const existingRevision = await prisma.revision.findFirst({
    where: {
      userId: user.id,
      topic: topicName,
    },
  });

  // Create revision schedule only if it doesn't exist
  if (!existingRevision) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.revision.create({
      data: {
        userId: user.id,
        subject: "Banking PO",
        topic: topicName,
        revisionCount: 0,
        nextRevision: tomorrow,
      },
    });
  }

  revalidatePath("/syllabus");
  revalidatePath("/dashboard");
  revalidatePath("/revision");
}
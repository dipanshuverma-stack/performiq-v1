"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Subject } from "@prisma/client";

export async function completeTopic(formData: FormData) {
  const subject = formData.get("subject") as Subject;
  const topicName = formData.get("topic") as string;

  if (!subject || !topicName) {
    throw new Error("Missing subject or topic data");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Toggle or create topic progress
  const existing = await prisma.topicProgress.findUnique({
    where: {
      userId_subject_topicName: {
        userId,
        subject,
        topicName,
      },
    },
  });

  const isNowCompleted = existing ? !existing.completed : true;

  if (existing) {
    await prisma.topicProgress.update({
      where: {
        userId_subject_topicName: {
          userId,
          subject,
          topicName,
        },
      },
      data: {
        completed: isNowCompleted,
      },
    });
  } else {
    await prisma.topicProgress.create({
      data: {
        userId,
        subject,
        topicName,
        completed: true,
      },
    });
  }

  // Auto-create revision if topic is now completed
  if (isNowCompleted) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.revision.upsert({
      where: {
        userId_topic: {
          userId,
          topic: topicName,
        },
      },
      update: {},
      create: {
        userId,
        subject,
        topic: topicName,
        revisionCount: 0,
        nextRevision: tomorrow,
      },
    });
  }

  revalidatePath("/syllabus");
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}
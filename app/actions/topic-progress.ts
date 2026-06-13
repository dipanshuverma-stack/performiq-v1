"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Subject } from "@prisma/client"; // ✅ Step 1: Imported the direct Subject enum

export async function completeTopic(formData: FormData) {
  // ✅ Step 2: Safely cast raw string to explicit database Subject enum values
  const subject = formData.get("subject") as Subject;
  const topicName = formData.get("topic") as string; 

  if (!subject || !topicName) {
    throw new Error("Missing subject or topic data");
  }

  const session = await auth();
  
  // 🚀 OPTIMIZATION: Extract the ID directly from the session token.
  // This bypasses the old prisma.user.findUnique email lookup completely!
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // 🔄 REAL TOGGLE LOGIC FOR TOPIC PROGRESS
  const existing = await prisma.topicProgress.findUnique({
    where: {
      userId_subject_topicName: {
        userId,
        subject,
        topicName,
      },
    },
  });

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
        completed: !existing.completed,
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

  const isNowCompleted = existing ? !existing.completed : true;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Look up and create revision schedules only if the topic is now marked completed
  if (isNowCompleted) {
    await prisma.revision.upsert({
      where: {
        userId_topic: {
          userId,
          topic: topicName,
        },
      },
      update: {}, // If it already exists, change nothing
      create: {
        userId,
        subject,
        topic: topicName,
        revisionCount: 0,
        nextRevision: tomorrow,
      },
    });
  }

  // ⚡ MUTATION INVALIDATION ENGINE WITH TS COMPLIANCE
  revalidateTag("stats", "max");

  // Instantly reset Next.js routing cache for these layouts
  revalidatePath("/syllabus");
}
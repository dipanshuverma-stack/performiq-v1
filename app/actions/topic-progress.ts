"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeTopic(formData: FormData) {
  const subject = formData.get("subject") as string;
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

  // Look up and create topic progress in 1 single trip
  await prisma.topicProgress.upsert({
    where: {
      userId_subject_topicName: {
        userId,
        subject,
        topicName,
      },
    },
    update: {}, // If it already exists, change nothing
    create: {
      userId,
      subject,
      topicName,
      completed: true,
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Look up and create revision schedules in 1 single trip
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

  // Instantly reset Next.js routing cache for these layouts
  revalidatePath("/syllabus");
  revalidatePath("/dashboard");
  revalidatePath("/revision");
  revalidatePath("/progress");
}
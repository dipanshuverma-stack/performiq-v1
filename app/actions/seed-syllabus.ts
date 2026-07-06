"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/config/syllabus";
import { revalidatePath } from "next/cache";
import { Subject } from "@prisma/client";

export async function seedSyllabus() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  // Flatten syllabus into records for batch creation
  const recordsToCreate = Object.entries(syllabus).flatMap(([subjectKey, topics]) =>
    topics.map((topic) => ({
      userId: user.id,
      subject: subjectKey as Subject,
      topicName: topic,
    }))
  );

  // Batch insert with duplicate skipping
  await prisma.topicProgress.createMany({
    data: recordsToCreate,
    skipDuplicates: true,
  });

  revalidatePath("/syllabus");
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BANKING_SYLLABUS } from "@/lib/data/banking-syllabus";

export async function seedSyllabus() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  // 1. Flatten the syllabus into a single array of records for batch insertion
  const recordsToCreate = Object.entries(BANKING_SYLLABUS).flatMap(([subject, topics]) =>
    topics.map((topic) => ({
      userId: user.id,
      subject,
      topicName: topic,
    }))
  );

  // 2. Perform a single batch operation
  // Note: skipDuplicates: true requires a unique constraint on your Prisma schema 
  // (e.g., @unique([userId, subject, topicName]))
  await prisma.topicProgress.createMany({
    data: recordsToCreate,
    skipDuplicates: true,
  });
}
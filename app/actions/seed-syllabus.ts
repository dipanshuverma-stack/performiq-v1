"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/lib/syllabus"; // 🎯 Unified source of truth with all 5 subjects
import { revalidatePath, revalidateTag } from "next/cache";

export async function seedSyllabus() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  // 1. Flatten the syllabus into a single array of records for batch insertion
  const recordsToCreate = Object.entries(syllabus).flatMap(([subject, topics]) =>
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

  // ⚡ COMPLIANT CACHE INVALIDATION
  // Wipes stale dashboard metrics instantly using the official production-safe signature
  revalidateTag("stats", "max");
  revalidatePath("/syllabus");
}
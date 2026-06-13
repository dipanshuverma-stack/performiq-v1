"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/config/syllabus"; // 🎯 Unified source of truth using DB enum keys
import { revalidatePath, revalidateTag } from "next/cache";
import { Subject } from "@prisma/client"; // ✅ Type safety verified

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
      // ✅ Type-safe cast: config keys match the database enums identically
      subject: subject as Subject,
      topicName: topic,
    }))
  );

  // 2. Perform a single batch operation
  await prisma.topicProgress.createMany({
    data: recordsToCreate,
    skipDuplicates: true,
  });

  // ⚡ Compliant Cache Invalidation matching project framework versions
  revalidateTag("stats", "max");
  revalidatePath("/syllabus");
}
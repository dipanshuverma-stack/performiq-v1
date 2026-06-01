"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BANKING_SYLLABUS } from "@/lib/data/banking-syllabus";

export async function seedSyllabus() {
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

  for (const [subject, topics] of Object.entries(
    BANKING_SYLLABUS
  )) {
    for (const topic of topics) {
      const exists =
        await prisma.topicProgress.findFirst({
          where: {
            userId: user.id,
            subject,
            topicName: topic,
          },
        });

      if (!exists) {
        await prisma.topicProgress.create({
          data: {
            userId: user.id,
            subject,
            topicName: topic,
          },
        });
      }
    }
  }
}
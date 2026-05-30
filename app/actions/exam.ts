"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createExamProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const examName = formData.get("examName") as string;
  const targetYear = Number(formData.get("targetYear"));

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.userExam.create({
    data: {
      userId: user.id,
      examName,
      targetYear,
      isPrimary: true,
    },
  });
}
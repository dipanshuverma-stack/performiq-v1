"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExamProfile(
  formData: FormData
) {
  const name = formData.get("name") as string;

  const examType = formData.get(
    "examType"
  ) as string;

  const targetDate = new Date(
    formData.get("targetDate") as string
  );

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

  await prisma.examProfile.create({
    data: {
      userId: user.id,
      name,
      examType,
      targetDate,
    },
  });

  revalidatePath("/exams");
  revalidatePath("/onboarding");
}

export async function activateExamProfile(
  examId: string
) {
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

  await prisma.examProfile.updateMany({
    where: {
      userId: user.id,
    },
    data: {
      isActive: false,
    },
  });

  await prisma.examProfile.update({
    where: {
      id: examId,
    },
    data: {
      isActive: true,
    },
  });

  revalidatePath("/exams");
  revalidatePath("/dashboard");
}
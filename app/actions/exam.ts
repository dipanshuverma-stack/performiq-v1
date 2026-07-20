"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ExamStage } from "@prisma/client";

const CreateProfileSchema = z.object({
  name: z.string().min(1, "Profile name is required"),
  stage: z.nativeEnum(ExamStage),
  customStage: z.string().optional().nullable(),
  targetDate: z
    .string()
    .min(1, "Valid target date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
});

async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User record not found");
  }

  return user.id;
}

export async function createExamProfile(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validation = CreateProfileSchema.safeParse({
    name: formData.get("name"),
    stage: formData.get("stage"),
    customStage: formData.get("customStage"),
    targetDate: formData.get("targetDate"),
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const { name, stage, customStage, targetDate } = validation.data;

  await prisma.examProfile.create({
    data: {
      userId,
      name,
      stage,
      customStage:
        stage === "CUSTOM" ? customStage?.trim() || null : null,
      targetDate,
    },
  });

  revalidatePath("/exams");
  revalidatePath("/dashboard");
}

export async function activateExamProfile(examId: string) {
  const userId = await getAuthenticatedUserId();

  const examProfile = await prisma.examProfile.findFirst({
    where: { id: examId, userId },
  });

  if (!examProfile) {
    throw new Error("Exam profile not found or access denied");
  }

  await prisma.$transaction([
    prisma.examProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    }),
    prisma.examProfile.update({
      where: { id: examId },
      data: { isActive: true },
    }),
  ]);

  revalidatePath("/exams");
  revalidatePath("/dashboard");
}
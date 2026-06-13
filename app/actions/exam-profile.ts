"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ExamType } from "@prisma/client";

// 1. Define schema requirements for Form validation
const CreateProfileSchema = z.object({
  name: z.string().min(1, "Profile name is required"),
  
  // ✅ Direct cast bypass: Expects a valid option token matching the Enum string variants
  examType: z
    .string()
    .min(1, "Exam type is required")
    .transform((val) => val as ExamType),
    
  targetDate: z
    .string()
    .min(1, "Valid target date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
});

/**
 * Helper to authenticate user session and return database user ID
 */
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

  // Validate form data fields
  const validation = CreateProfileSchema.safeParse({
    name: formData.get("name"),
    examType: formData.get("examType"),
    targetDate: formData.get("targetDate"),
  });

  if (!validation.success) {
    throw new Error(`Validation Error: ${validation.error.message}`);
  }

  const { name, examType, targetDate } = validation.data;

  // ✅ Clean, map-free insert execution pass
  await prisma.examProfile.create({
    data: {
      userId,
      name,
      examType, 
      targetDate,
    },
  });

  revalidatePath("/exams");
  revalidatePath("/onboarding");
}

export async function activateExamProfile(examId: string) {
  const userId = await getAuthenticatedUserId();

  // Verify ownership before modification
  const examProfile = await prisma.examProfile.findFirst({
    where: { id: examId, userId },
  });

  if (!examProfile) {
    throw new Error("Exam profile not found or access denied");
  }

  // Atomic transaction ensures consistent active status
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
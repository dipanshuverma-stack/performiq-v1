"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMockTest(
  formData: FormData
) {
  const exam = formData.get("exam") as string;
  const score = Number(formData.get("score"));
  const totalQuestions = Number(
    formData.get("totalQuestions")
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

  const accuracy =
    totalQuestions > 0
      ? (score / totalQuestions) * 100
      : 0;

  await prisma.mockTest.create({
    data: {
      userId: user.id,
      exam,
      score,
      totalQuestions,
      accuracy,
    },
  });

  revalidatePath("/mocks");
  revalidatePath("/dashboard");
}
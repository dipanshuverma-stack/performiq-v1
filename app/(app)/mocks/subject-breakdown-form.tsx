"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSubjectPerformance(
  formData: FormData
) {
  const mockId = formData.get("mockId") as string;
  const userId = formData.get("userId") as string;

  const subjects = [
    "Reasoning",
    "Quant",
    "English",
    "GA",
    "Computer",
  ];

  for (const subject of subjects) {
    const totalQuestions = Number(
      formData.get(`${subject}_total`) || 0
    );

    if (totalQuestions === 0) continue;

    const correct = Number(
      formData.get(`${subject}_correct`) || 0
    );

    const incorrect = Number(
      formData.get(`${subject}_incorrect`) || 0
    );

    const attempted = correct + incorrect;

    const accuracy =
      attempted > 0
        ? (correct / attempted) * 100
        : 0;

    await prisma.mockSubjectPerformance.create({
      data: {
        userId,
        mockId,

        subject,

        totalQuestions,

        attempted,

        correct,

        incorrect,

        score: correct,

        accuracy,
      },
    });
  }

  revalidatePath("/mocks");
}
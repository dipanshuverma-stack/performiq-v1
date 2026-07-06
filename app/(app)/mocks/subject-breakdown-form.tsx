"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Subject } from "@prisma/client";
import { SUBJECT_MAP } from "@/config/subjects";

export async function saveSubjectPerformance(formData: FormData) {
  const mockId = formData.get("mockId") as string;
  const userId = formData.get("userId") as string;

  if (!mockId || !userId) {
    throw new Error("Missing mockId or userId.");
  }

  const subjects = ["Reasoning", "Quant", "English", "GA", "Computer"] as const;

  const transactionPayload: Array<{
    userId: string;
    mockId: string;
    subject: Subject;
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
    accuracy: number;
  }> = [];

  for (const subjectName of subjects) {
    const totalQuestions = Number(formData.get(`${subjectName}_total`) || 0);
    if (totalQuestions <= 0) continue;

    const correct = Math.max(0, Number(formData.get(`${subjectName}_correctQuestions`) || 0));
    const incorrect = Math.max(0, Number(formData.get(`${subjectName}_incorrectQuestions`) || 0));

    const attempted = correct + incorrect;

    if (attempted > totalQuestions) {
      throw new Error(`Attempted questions exceed total for ${subjectName}`);
    }

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    transactionPayload.push({
      userId,
      mockId,
      subject: SUBJECT_MAP[subjectName as keyof typeof SUBJECT_MAP],
      totalQuestions,
      attempted,
      correct,
      incorrect,
      score: correct,           // Usually score = correct answers
      accuracy,
    });
  }

  if (transactionPayload.length > 0) {
    await prisma.mockSubjectPerformance.createMany({
      data: transactionPayload,
      skipDuplicates: true,     // Safety against duplicate entries
    });
  }

  // Revalidate relevant pages
  revalidatePath("/mocks");
  revalidatePath(`/mocks/${mockId}`);

  return { success: true };
}
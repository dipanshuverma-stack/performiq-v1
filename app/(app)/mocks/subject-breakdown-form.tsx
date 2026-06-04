"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSubjectPerformance(formData: FormData) {
  const mockId = formData.get("mockId") as string;
  const userId = formData.get("userId") as string;

  if (!mockId || !userId) {
    throw new Error("Missing structural identification keys (mockId, userId).");
  }

  const subjects = ["Reasoning", "Quant", "English", "GA", "Computer"];
  
  // Build write payload matrix in-memory
  const transactionPayload: Array<{
    userId: string;
    mockId: string;
    subject: string;
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
    accuracy: number;
  }> = [];

  for (const subject of subjects) {
    const totalQuestions = Number(formData.get(`${subject}_total`) || 0);

    // Bypass inactive subjects gracefully
    if (totalQuestions === 0) continue;

    const correct = Math.max(0, Number(formData.get(`${subject}_correct`) || 0));
    const incorrect = Math.max(0, Number(formData.get(`${subject}_incorrect`) || 0));
    const attempted = correct + incorrect;

    // Boundary safety: ensure attempted counts never exceed total capacity thresholds
    if (attempted > totalQuestions) {
      throw new Error(`Invalid telemetry payload: Attempted questions exceed total allocation for ${subject}.`);
    }

    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    transactionPayload.push({
      userId,
      mockId,
      subject,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      score: correct, // Assuming direct linear scoring models
      accuracy,
    });
  }

  // Execute an atomic database transaction if data exists
  if (transactionPayload.length > 0) {
    try {
      await prisma.$transaction([
        prisma.mockSubjectPerformance.createMany({
          data: transactionPayload,
        }),
      ]);
    } catch (error) {
      console.error("Failed to execute subject performance transaction:", error);
      throw new Error("Database transaction failed. Performance data was not saved.");
    }
  }

  // Purge data caches downstream to maintain application-wide consistency
  revalidatePath("/mocks");
  revalidatePath(`/mocks/${mockId}`);
}
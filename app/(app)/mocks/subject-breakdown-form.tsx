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

  const subjects = [
    "Reasoning",
    "Quant",
    "English",
    "GA",
    "Computer",
  ];

  const transactionPayload = [];

  for (const subjectName of subjects) {
    const totalQuestions = Number(
      formData.get(`${subjectName}_total`) || 0
    );

    // Skip processing fields that have no assigned questions
    if (totalQuestions === 0) continue;

    // ✅ Fix #1: Extracted directly into 'correct' and 'incorrect' tokens 
    // while keeping HTML string names fully operational
    const correct = Math.max(
      0,
      Number(formData.get(`${subjectName}_correctQuestions`) || 0)
    );

    const incorrect = Math.max(
      0,
      Number(formData.get(`${subjectName}_incorrectQuestions`) || 0)
    );

    // ✅ Fix #2: Mathematical properties and accuracy calculations updated
    const attempted = correct + incorrect;

    if (attempted > totalQuestions) {
      throw new Error(
        `Attempted questions exceed total for ${subjectName}`
      );
    }

    const accuracy =
      attempted > 0 ? (correct / attempted) * 100 : 0;

    // ✅ Fix #2 continued: Object property payload tailored to match schema.prisma contracts
    transactionPayload.push({
      userId,
      mockId,
      subject: SUBJECT_MAP[subjectName],
      totalQuestions,
      attempted,
      correct,   // ✅ Normalized property
      incorrect, // ✅ Normalized property
      score: correct,
      accuracy,
    });
  }

  if (transactionPayload.length > 0) {
    await prisma.mockSubjectPerformance.createMany({
      data: transactionPayload,
    });
  }

  revalidatePath("/mocks");
  revalidatePath(`/mocks/${mockId}`);
}
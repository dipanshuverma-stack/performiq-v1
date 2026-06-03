"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const MockTestSchema = z.object({
  exam: z.string().min(1),
  title: z.string().optional(),
  mockType: z.enum(["PRELIMS", "MAINS"]).nullable(),
  score: z.coerce.number().default(0),
  totalQuestions: z.coerce.number().default(0),
  correctAnswers: z.coerce.number().default(0),
  incorrectAnswers: z.coerce.number().default(0),
  unattemptedQuestions: z.coerce.number().default(0),
  duration: z.coerce.number().default(0),
  notes: z.string().optional(),
  reasoningScore: z.coerce.number().default(0),
  quantScore: z.coerce.number().default(0),
  englishScore: z.coerce.number().default(0),
  gaScore: z.coerce.number().default(0),
  computerScore: z.coerce.number().default(0),
});

export async function createMockTest(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");

  const data = MockTestSchema.parse(Object.fromEntries(formData.entries()));
  const attemptedQuestions = data.correctAnswers + data.incorrectAnswers;
  const accuracy = attemptedQuestions > 0 ? (data.correctAnswers / attemptedQuestions) * 100 : 0;

  // Use a transaction to handle Mock, Subject Performance, and Revision creation atomically
  await prisma.$transaction(async (tx) => {
    const mock = await tx.mockTest.create({
      data: {
        userId: user.id,
        exam: data.exam,
        title: data.title,
        mockType: data.mockType,
        score: data.score,
        totalQuestions: data.totalQuestions,
        attemptedQuestions,
        correctAnswers: data.correctAnswers,
        incorrectAnswers: data.incorrectAnswers,
        unattemptedQuestions: data.unattemptedQuestions,
        accuracy,
        duration: data.duration > 0 ? data.duration : null,
        notes: data.notes,
      },
    });

    // Prepare Subject Performances
    const subjects = [
      { subject: "Reasoning", score: data.reasoningScore },
      { subject: "Quant", score: data.quantScore },
      { subject: "English", score: data.englishScore },
      ...(data.mockType === "MAINS" ? [
        { subject: "GA", score: data.gaScore },
        { subject: "Computer", score: data.computerScore }
      ] : [])
    ];

    const validPerformances = subjects.filter(s => s.score > 0);

    if (validPerformances.length > 0) {
      await tx.mockSubjectPerformance.createMany({
        data: validPerformances.map(s => ({
          userId: user.id,
          mockId: mock.id,
          subject: s.subject,
          score: s.score,
          totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, accuracy: 0
        }))
      });

      // Auto-create revision tasks for weak subjects (Score < 20)
      for (const s of validPerformances.filter(s => s.score < 20)) {
        const existing = await tx.revision.findFirst({
          where: { userId: user.id, subject: s.subject },
        });

        if (!existing) {
          await tx.revision.create({
            data: {
              userId: user.id,
              subject: s.subject,
              topic: `${s.subject} Improvement`,
              nextRevision: new Date(Date.now() + 86400000), // 24 hours
            },
          });
        }
      }
    }
  });

  // ⚡ MUTATION INVALIDATION ENGINE WITH TS COMPLIANCE
  // Passed 'undefined as any' to satisfy strict environment signature requirements
  revalidateTag("performance", undefined as any); 
  
  revalidatePath("/mocks");
  revalidatePath("/dashboard");
}
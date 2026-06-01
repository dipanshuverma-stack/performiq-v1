"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMockTest(
  formData: FormData
) {
  const exam = formData.get("exam") as string;

  const title =
    (formData.get("title") as string) || null;

  const mockType =
    (formData.get("mockType") as
      | "PRELIMS"
      | "MAINS") || null;

  const score = Number(
    formData.get("score") || 0
  );

  const totalQuestions = Number(
    formData.get("totalQuestions") || 0
  );

  const correctAnswers = Number(
    formData.get("correctAnswers") || 0
  );

  const incorrectAnswers = Number(
    formData.get("incorrectAnswers") || 0
  );

  const unattemptedQuestions = Number(
    formData.get("unattemptedQuestions") || 0
  );

  const duration = Number(
    formData.get("duration") || 0
  );

  const notes =
    (formData.get("notes") as string) || null;

  const reasoningScore = Number(
    formData.get("reasoningScore") || 0
  );

  const quantScore = Number(
    formData.get("quantScore") || 0
  );

  const englishScore = Number(
    formData.get("englishScore") || 0
  );

  const gaScore = Number(
    formData.get("gaScore") || 0
  );

  const computerScore = Number(
    formData.get("computerScore") || 0
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

  const attemptedQuestions =
    correctAnswers + incorrectAnswers;

  const accuracy =
    attemptedQuestions > 0
      ? (correctAnswers / attemptedQuestions) *
        100
      : 0;

  const mock = await prisma.mockTest.create({
    data: {
      userId: user.id,

      exam,
      title,
      mockType,

      score,
      totalQuestions,

      attemptedQuestions,

      correctAnswers,
      incorrectAnswers,
      unattemptedQuestions,

      accuracy,

      duration:
        duration > 0 ? duration : null,

      notes,
    },
  });

  const subjectPerformances = [];

  if (reasoningScore > 0) {
    subjectPerformances.push({
      userId: user.id,
      mockId: mock.id,
      subject: "Reasoning",
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      score: reasoningScore,
      accuracy: 0,
    });
  }

  if (quantScore > 0) {
    subjectPerformances.push({
      userId: user.id,
      mockId: mock.id,
      subject: "Quant",
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      score: quantScore,
      accuracy: 0,
    });
  }

  if (englishScore > 0) {
    subjectPerformances.push({
      userId: user.id,
      mockId: mock.id,
      subject: "English",
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      score: englishScore,
      accuracy: 0,
    });
  }

  if (mockType === "MAINS" && gaScore > 0) {
    subjectPerformances.push({
      userId: user.id,
      mockId: mock.id,
      subject: "GA",
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      score: gaScore,
      accuracy: 0,
    });
  }

  if (
    mockType === "MAINS" &&
    computerScore > 0
  ) {
    subjectPerformances.push({
      userId: user.id,
      mockId: mock.id,
      subject: "Computer",
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      score: computerScore,
      accuracy: 0,
    });
  }

  if (subjectPerformances.length > 0) {
  await prisma.mockSubjectPerformance.createMany({
    data: subjectPerformances,
  });

  // Auto-create revision tasks for weak subjects
  for (const subject of subjectPerformances) {
    if (subject.score < 20) {
      const existingRevision =
        await prisma.revision.findFirst({
          where: {
            userId: user.id,
            subject: subject.subject,
          },
        });

      if (!existingRevision) {
        await prisma.revision.create({
  data: {
    userId: user.id,
    subject: subject.subject,
    topic: `${subject.subject} Improvement`,
    nextRevision: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ),
  },
});
      }
    }
  }
}

  revalidatePath("/mocks");
  revalidatePath("/dashboard");
}
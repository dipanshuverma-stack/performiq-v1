"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// Combined Prisma enum imports per step 2.1
import {
  ExamType,
  MockType,
  Prisma,
  RewardAction,
  RewardType,
} from "@prisma/client";
import { createId } from "@paralleldrive/cuid2"; 
import { SUBJECT_MAP } from "@/lib/mock/subject-map";
import { saveTopicInsights } from "@/lib/mock/save-topic-insights";
import { rebuildTopicProgress } from "@/lib/mock/rebuild-topic-progress";
import { addReward } from "@/lib/rewards/reward-log";
import { REWARD_POINTS } from "@/lib/rewards/constants";
import { removeReward } from "@/lib/rewards/remove-reward";
import { updateStreak } from "@/lib/rewards/streak";

const MockTestSchema = z.object({
  exam: z.string().min(1),
  title: z.string().optional(),
  mockType: z.enum(["PRELIMS", "MAINS"]).nullable(),
  score: z.coerce.number().default(0),
  totalQuestions: z.coerce.number().default(0),
  correctAnswers: z.coerce.number().default(0),
  incorrectAnswers: z.coerce.number().default(0),
  duration: z.coerce.number().default(0),
  notes: z.string().optional(),
});

type SubjectStats = {
  score: number;
  questions: number;
  correct: number;
  incorrect: number;
};

const round2 = (num: number) => Number(num.toFixed(2));

export async function createMockTest(formData: FormData) {
  console.time("createMockTest");

  console.time("auth");
  const session = await auth();
  console.timeEnd("auth");

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = MockTestSchema.parse(Object.fromEntries(formData.entries()));

  const weakTopics = JSON.parse(
    decodeURIComponent((formData.get("weakTopics") as string) || "{}")
  ) as Record<string, string[]>;

  const strongTopics = JSON.parse(
    decodeURIComponent((formData.get("strongTopics") as string) || "{}")
  ) as Record<string, string[]>;

  const subjectStats = JSON.parse(
    decodeURIComponent((formData.get("subjectStats") as string) || "{}")
  ) as Record<string, SubjectStats>;

  const attemptedQuestions = data.correctAnswers + data.incorrectAnswers;
  const rawMockAccuracy = attemptedQuestions > 0 ? (data.correctAnswers / attemptedQuestions) * 100 : 0;
  const accuracy = round2(rawMockAccuracy);
  const unattemptedQuestions = data.totalQuestions - attemptedQuestions;

  // 1. Pre-generate ID to minimize transaction open times
  const mockId = createId();

  // 2. Fully type-checked payload array
  const subjectPerformanceRows: Prisma.MockSubjectPerformanceCreateManyInput[] = [];
  
  for (const [subjectName, stats] of Object.entries(subjectStats)) {
    const { score, questions, correct, incorrect } = stats;
    if (score === 0 && questions === 0 && correct === 0 && incorrect === 0) continue;

    const resolvedSubject = SUBJECT_MAP[subjectName];
    if (!resolvedSubject) continue;

    const attempted = correct + incorrect;
    const rawSubjectAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    subjectPerformanceRows.push({
      id: createId(), 
      userId,
      mockId, 
      subject: resolvedSubject,
      score: round2(score),
      totalQuestions: questions,
      attempted,
      correct,
      incorrect,
      accuracy: round2(rawSubjectAccuracy),
    });
  }

  console.time("transaction");
  await prisma.$transaction(async (tx) => {
    
    console.time("mock.create");
    await tx.mockTest.create({
      data: {
        id: mockId,
        userId,
        exam: data.exam as ExamType,
        title: data.title,
        mockType: data.mockType as MockType | null,
        score: data.score,
        totalQuestions: data.totalQuestions,
        attemptedQuestions,
        correctAnswers: data.correctAnswers,
        incorrectAnswers: data.incorrectAnswers,
        unattemptedQuestions: unattemptedQuestions > 0 ? unattemptedQuestions : 0,
        accuracy,
        duration: data.duration > 0 ? data.duration : null,
        notes: data.notes,
      },
    });
    console.timeEnd("mock.create");

    if (subjectPerformanceRows.length > 0) {
      console.time("subject.createMany");
      await tx.mockSubjectPerformance.createMany({ 
        data: subjectPerformanceRows 
      });
      console.timeEnd("subject.createMany");
    }

    console.time("combinedTopicInsights");
    await saveTopicInsights(tx, userId, mockId, weakTopics, strongTopics);
    console.timeEnd("combinedTopicInsights");
  });
  console.timeEnd("transaction");

  // Step 2.2 — Award reward right after transaction block completes
  console.time("reward");
  await addReward(
    userId,
    RewardType.MOCK,
    RewardAction.EARN,
    REWARD_POINTS.MOCK_COMPLETION,
    "Mock Completed",
    data.title || `${data.exam} Mock`,
    mockId
  );
  
  // Step 7 — Call updateStreak() from Mock completion
  await updateStreak(userId);
  console.timeEnd("reward");

  console.time("rebuildWeak");
  await rebuildTopicProgress(userId, weakTopics, "WEAK");
  console.timeEnd("rebuildWeak");

  console.time("rebuildStrong");
  await rebuildTopicProgress(userId, strongTopics, "STRONG");
  console.timeEnd("rebuildStrong");

  console.time("revalidate");
  revalidatePath("/mocks");
  revalidatePath("/dashboard");
  console.timeEnd("revalidate");

  console.timeEnd("createMockTest");
}

export async function deleteMockTest(mockId: string) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const mock = await prisma.mockTest.findUnique({
    where: {
      id: mockId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!mock || mock.userId !== userId) {
    throw new Error("Mock not found");
  }

  await removeReward(mock.id);

  await prisma.mockTest.delete({
    where: {
      id: mock.id,
    },
  });

  revalidatePath("/mocks");
  revalidatePath("/dashboard");
}
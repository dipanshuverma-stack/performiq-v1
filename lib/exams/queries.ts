import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getExamProfiles = cache(async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      examProfiles: {
        select: {
          id: true,
          name: true,
          stage: true,
          customStage: true,
          isActive: true,
          targetDate: true,
          readiness: true,
        },
      },
    },
  });

  if (!user) return null;

  const activeExam =
    user.examProfiles.find((exam) => exam.isActive) ?? null;

  let daysRemaining: number | null = null;
  if (activeExam) {
    daysRemaining = Math.ceil(
      (activeExam.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  }

  return {
    userId: user.id,
    activeExam,
    daysRemaining,
    examProfiles: user.examProfiles,
  };
});
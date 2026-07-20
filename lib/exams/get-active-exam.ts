import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface ActiveExam {
  id: string;
  name: string;
  stage: string;
  customStage: string | null;
  isActive: boolean;
  targetDate: Date;
  readiness: number;
  // Add other fields as needed
}

const cachedGetActiveExam = cache(async (userId: string) => {
  return prisma.examProfile.findFirst({
    where: {
      userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      stage: true,
      customStage: true,
      isActive: true,
      targetDate: true,
      readiness: true,
    },
  });
});

export async function getActiveExam(userId: string) {
  return cachedGetActiveExam(userId);
}
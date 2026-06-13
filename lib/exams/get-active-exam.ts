import { prisma } from "@/lib/prisma";

export async function getActiveExam(
  userId: string
) {
  return prisma.examProfile.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });
}
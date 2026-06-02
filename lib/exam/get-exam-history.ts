import { prisma } from "@/lib/prisma";

export async function getExamHistory(
  userId: string
) {
  return prisma.examSimulation.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
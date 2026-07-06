import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface SyllabusProgress {
  totalTopics: number;
  completedTopics: number;
  percentage: string;
}

const cachedGetSyllabusProgress = cache(async (userId: string): Promise<SyllabusProgress> => {
  const [totalTopics, completedTopics] = await Promise.all([
    prisma.topicProgress.count({ where: { userId } }),
    prisma.topicProgress.count({ where: { userId, completed: true } }),
  ]);

  const percentage = totalTopics > 0
    ? ((completedTopics / totalTopics) * 100).toFixed(1)
    : "0";

  return {
    totalTopics,
    completedTopics,
    percentage,
  };
});

export async function getSyllabusProgress(userId: string): Promise<SyllabusProgress> {
  return cachedGetSyllabusProgress(userId);
}
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Subject } from "@prisma/client";

export interface SubjectIntelligenceItem {
  subject: Subject;
  mocks: number;
  averageScore: number;
  averageAccuracy: number;
}

export interface SubjectIntelligence {
  subjects: SubjectIntelligenceItem[];
  strongestSubject: SubjectIntelligenceItem | null;
  weakestSubject: SubjectIntelligenceItem | null;
}

const cachedGetSubjectIntelligence = cache(async (
  userId: string
): Promise<SubjectIntelligence> => {
  const performances = await prisma.mockSubjectPerformance.findMany({
    where: { userId },
    select: {
      subject: true,
      score: true,
      accuracy: true,
    },
  });

  const subjects: Subject[] = [
    Subject.REASONING_ABILITY,
    Subject.QUANTITATIVE_APTITUDE,
    Subject.ENGLISH_LANGUAGE,
    Subject.GENERAL_AWARENESS,
    Subject.COMPUTER_AWARENESS,
  ];

  const intelligence = subjects
    .map((subject) => {
      const records = performances.filter((item) => item.subject === subject);

      if (records.length === 0) return null;

      const totalScore = records.reduce((sum, item) => sum + (item.score ?? 0), 0);
      const totalAccuracy = records.reduce((sum, item) => sum + (item.accuracy ?? 0), 0);

      return {
        subject,
        mocks: records.length,
        averageScore: Number((totalScore / records.length).toFixed(2)),
        averageAccuracy: Number((totalAccuracy / records.length).toFixed(2)),
      };
    })
    .filter((item): item is SubjectIntelligenceItem => item !== null);

  const sorted = [...intelligence].sort((a, b) => b.averageScore - a.averageScore);

  return {
    subjects: intelligence,
    strongestSubject: sorted[0] ?? null,
    weakestSubject: sorted[sorted.length - 1] ?? null,
  };
});

export async function getSubjectIntelligence(userId: string): Promise<SubjectIntelligence> {
  return cachedGetSubjectIntelligence(userId);
}
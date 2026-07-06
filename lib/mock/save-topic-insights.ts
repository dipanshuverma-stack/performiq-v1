import { Prisma, TopicInsightType } from "@prisma/client";
import { SUBJECT_MAP } from "./subject-map";

export async function saveTopicInsights(
  tx: Prisma.TransactionClient,
  userId: string,
  mockId: string,
  weakTopicsData: Record<string, string[]>,
  strongTopicsData: Record<string, string[]>
) {
  const rows: Prisma.MockTopicInsightCreateManyInput[] = [];

  const stageInsights = (topicsData: Record<string, string[]>, type: TopicInsightType) => {
    for (const [subjectName, topics] of Object.entries(topicsData)) {
      const resolvedSubject = SUBJECT_MAP[subjectName];
      if (!resolvedSubject) continue;

      const uniqueTopics = [...new Set(topics.map((t) => t.trim()))];

      for (const topic of uniqueTopics) {
        if (!topic) continue;

        rows.push({
          userId,
          mockId,
          subject: resolvedSubject,
          topic,
          type,
        });
      }
    }
  };

  stageInsights(weakTopicsData, "WEAK");
  stageInsights(strongTopicsData, "STRONG");

  if (rows.length > 0) {
    console.log(`[Insight Batch] Staging ${rows.length} rows`);
    
    // Return the promise directly to allow concurrent scheduling
    return tx.mockTopicInsight.createMany({
      data: rows,
    });
  }
  
  return null;
}
import { prisma } from "@/lib/prisma";
import { TopicInsightType } from "@prisma/client";
import { SUBJECT_MAP } from "./subject-map";

export async function rebuildTopicProgress(
  userId: string,
  topicsData: Record<string, string[]>,
  type: TopicInsightType
) {
  const allTopics: {
    subject: keyof typeof SUBJECT_MAP;
    topic: string;
  }[] = [];

  for (const [subjectName, topics] of Object.entries(topicsData)) {
    const subject = SUBJECT_MAP[subjectName];

    if (!subject) continue;

    const uniqueTopics = [...new Set(topics.map((t) => t.trim()))];

    for (const topic of uniqueTopics) {
      if (!topic) continue;

      allTopics.push({
        subject,
        topic,
      });
    }
  }

  console.log(allTopics);
}
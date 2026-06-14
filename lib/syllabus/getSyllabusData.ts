import { prisma } from "@/lib/prisma";
import { 
  BANKING_SYLLABUS, 
  SUBJECT_LABELS, 
  TOTAL_TOPIC_COUNT 
} from "@/config/syllabus";

export type Weightage = "HIGH" | "MEDIUM" | "LOW";

export interface TopicViewModel {
  id: string;
  name: string;
  completed: boolean;
  estimatedMinutes: number;
  weightage: Weightage;
  tags: string[];
}

export interface SubjectViewModel {
  key: string;
  title: string;
  completedCount: number;
  totalCount: number;
  topics: TopicViewModel[];
}

export interface SyllabusData {
  progress: {
    completedCount: number;
    totalCount: number;
    percentage: number;
  };
  subjects: SubjectViewModel[];
}

export async function getSyllabusData(userId: string): Promise<SyllabusData> {
  const completedTopics = await prisma.topicProgress.findMany({
    where: { userId, completed: true },
    select: { subject: true, topicName: true },
  });

  const getTopicKey = (subject: string, topic: string) => `${subject}:${topic}`;
  const completionSet = new Set<string>();
  const subjectCounts = new Map<string, number>();

  completedTopics.forEach((item) => {
    completionSet.add(getTopicKey(item.subject, item.topicName));
    subjectCounts.set(item.subject, (subjectCounts.get(item.subject) ?? 0) + 1);
  });

  const subjects: SubjectViewModel[] = Object.entries(BANKING_SYLLABUS).map(([subjectKey, topicsArray]) => {
    const rawTopics = Array.isArray(topicsArray) ? topicsArray : [];
    
    const topics: TopicViewModel[] = rawTopics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      completed: completionSet.has(getTopicKey(subjectKey, topic.name)),
      // Map these from your config object
      estimatedMinutes: topic.estimatedMinutes ?? 30,
      weightage: (topic.weightage as Weightage) ?? "LOW",
      tags: topic.tags ?? [],
    }));

    return {
      key: subjectKey,
      title: SUBJECT_LABELS[subjectKey as keyof typeof SUBJECT_LABELS] ?? subjectKey,
      completedCount: subjectCounts.get(subjectKey) ?? 0,
      totalCount: topics.length,
      topics,
    };
  });

  return {
    progress: {
      completedCount: completedTopics.length,
      totalCount: TOTAL_TOPIC_COUNT,
      percentage: TOTAL_TOPIC_COUNT === 0 ? 0 : (completedTopics.length / TOTAL_TOPIC_COUNT) * 100,
    },
    subjects,
  };
}
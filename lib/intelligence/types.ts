export type TopicPriority = {
  topic: string;

  score: number;

  priority:
    | "HIGH"
    | "MEDIUM"
    | "LOW";

  knowledgeScore: number;

  speedScore: number;

  reasons: string[];
};
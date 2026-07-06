export type TopicPriority = {
  topic: string;
  subject: string;           // Added for consistency
  score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  knowledgeScore: number;
  speedScore: number;
  masteryScore?: number;     // Optional if not always used
  practiceCount?: number;
  mockAccuracy?: number;
  unresolvedMistakes?: number;
  recommendedAction?: "Revise" | "Timed Practice" | "Concept Building" | "Maintain";
  reasons: string[];
};
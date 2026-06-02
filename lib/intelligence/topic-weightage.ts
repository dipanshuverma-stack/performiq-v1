export type ExamProfile =
  | "SBI_PO_PRELIMS"
  | "SBI_CLERK_PRELIMS";

export const TOPIC_WEIGHTAGES: Record<
  ExamProfile,
  Record<string, number>
> = {
  SBI_PO_PRELIMS: {
    // Reasoning
    Puzzle: 25,
    "Seating Arrangement": 25,
    Syllogism: 12,
    Inequality: 10,
    "Coding-Decoding": 8,
    "Blood Relation": 6,
    "Direction Sense": 6,
    "Order Ranking": 6,
    "Input Output": 12,
    "Data Sufficiency": 10,

    // Quant
    "Data Interpretation": 25,
    Simplification: 15,
    Approximation: 15,
    "Quadratic Equation": 12,
    "Number Series": 12,
    Percentage: 15,
    Average: 12,
    "Profit and Loss": 12,
    "Time and Work": 12,
    "Time Speed Distance": 12,
    "Ratio and Proportion": 12,

    // English
    "Reading Comprehension": 20,
    "Cloze Test": 15,
    "Error Detection": 12,
    Fillers: 10,
    "Para Jumbles": 10,
    Vocabulary: 8,
    Grammar: 12,
  },

  SBI_CLERK_PRELIMS: {
    // Reasoning
    Puzzle: 25,
    "Seating Arrangement": 20,
    Syllogism: 12,
    Inequality: 10,
    "Coding-Decoding": 15,
    "Blood Relation": 8,
    "Direction Sense": 8,
    "Order Ranking": 8,

    // Quant
    Simplification: 25,
    Approximation: 25,
    "Data Interpretation": 15,
    "Quadratic Equation": 12,
    "Number Series": 12,
    Percentage: 10,
    Average: 10,

    // English
    "Reading Comprehension": 20,
    "Cloze Test": 15,
    Fillers: 12,
    "Error Detection": 12,
    Vocabulary: 8,
  },
};

export function getTopicWeightage(
  profile: ExamProfile,
  topic: string
) {
  return (
    TOPIC_WEIGHTAGES[profile]?.[topic] ?? 5
  );
}
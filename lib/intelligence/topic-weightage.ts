import { Subject } from "@prisma/client";

export type ExamProfile =
  | "SBI_PO_PRELIMS"
  | "SBI_CLERK_PRELIMS"
  | "IBPS_PO_PRELIMS"
  | "RRB_PO_PRELIMS";

export const TOPIC_WEIGHTAGES: Record<ExamProfile, Record<string, number>> = {
  SBI_PO_PRELIMS: {
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

    "Reading Comprehension": 20,
    "Cloze Test": 15,
    "Error Detection": 12,
    Fillers: 10,
    "Para Jumbles": 10,
    Vocabulary: 8,
    Grammar: 12,
  },

  SBI_CLERK_PRELIMS: {
    Puzzle: 25,
    "Seating Arrangement": 20,
    Syllogism: 12,
    Inequality: 10,
    "Coding-Decoding": 15,
    "Blood Relation": 8,
    "Direction Sense": 8,
    "Order Ranking": 8,

    Simplification: 25,
    Approximation: 25,
    "Data Interpretation": 15,
    "Quadratic Equation": 12,
    "Number Series": 12,
    Percentage: 10,
    Average: 10,

    "Reading Comprehension": 20,
    "Cloze Test": 15,
    Fillers: 12,
    "Error Detection": 12,
    Vocabulary: 8,
  },

  // Add missing profiles (default or copy from SBI_PO_PRELIMS)
  IBPS_PO_PRELIMS: {
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

    "Reading Comprehension": 20,
    "Cloze Test": 15,
    "Error Detection": 12,
    Fillers: 10,
    "Para Jumbles": 10,
    Vocabulary: 8,
    Grammar: 12,
  },

  RRB_PO_PRELIMS: {
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

    "Reading Comprehension": 20,
    "Cloze Test": 15,
    "Error Detection": 12,
    Fillers: 10,
    "Para Jumbles": 10,
    Vocabulary: 8,
    Grammar: 12,
  },
};

export function getTopicWeightage(
  exam: { name?: string } | null,
  topic: string
): number {
  if (!exam) return 10; // Default if no active exam

  const name = exam.name?.toUpperCase() || "";

  let profile: ExamProfile = "SBI_PO_PRELIMS";

  if (name.includes("SBI") && name.includes("PO")) profile = "SBI_PO_PRELIMS";
  else if (name.includes("SBI") && name.includes("CLERK")) profile = "SBI_CLERK_PRELIMS";
  else if (name.includes("IBPS") && name.includes("PO")) profile = "IBPS_PO_PRELIMS";
  else if (name.includes("RRB") && name.includes("PO")) profile = "RRB_PO_PRELIMS";

  return TOPIC_WEIGHTAGES[profile]?.[topic] ?? 5;
}
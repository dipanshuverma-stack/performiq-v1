/**
 * PerformIQ Domain Types
 * These types are decoupled from Prisma to ensure:
 * 1. Frontend portability (no DB-specific imports)
 * 2. Easier testing and mocking
 * 3. Reduced bundle size
 */

export type Subject =
  | "QUANTITATIVE_APTITUDE"
  | "REASONING_ABILITY"
  | "ENGLISH_LANGUAGE"
  | "GENERAL_AWARENESS"
  | "COMPUTER_AWARENESS";

export type SectionType = "PRELIMS" | "MAINS";

export type ExamType =
  | "IBPS_PO"
  | "IBPS_CLERK"
  | "SBI_PO"
  | "SBI_CLERK"
  | "RRB_PO"
  | "RRB_CLERK"
  | "RBI_ASSISTANT"
  | "RBI_GRADE_B"
  | "NABARD"
  | "LIC_AAO";

export type TopicWeightage = "HIGH" | "MEDIUM" | "LOW";

export interface SyllabusTopic {
  id: string;               // Immutable system ID (e.g., "quant_percentage")
  slug: string;             // URL-safe route (e.g., "percentages")
  name: string;             // Display name (e.g., "Percentage & Applications")
  displayOrder: number;      // Sorting order
  section: SectionType;      // Classification
  examTypes: ExamType[];    // Targeted exam alignment
  tags: string[];           // Metadata for search & AI
  weightage: TopicWeightage; // Dashboard/UI priority
  estimatedMinutes: number;  // Progress tracking
}
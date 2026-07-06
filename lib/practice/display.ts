import { Subject } from "@prisma/client";

export const SUBJECT_LABELS: Record<Subject, string> = {
  QUANTITATIVE_APTITUDE: "Quantitative Aptitude",
  REASONING_ABILITY: "Reasoning Ability",
  ENGLISH_LANGUAGE: "English Language",
  GENERAL_AWARENESS: "General Awareness",
  COMPUTER_AWARENESS: "Computer Awareness",
} as const;

export function getSubjectLabel(subject: Subject): string {
  return SUBJECT_LABELS[subject] ?? subject.replace(/_/g, " ");
}
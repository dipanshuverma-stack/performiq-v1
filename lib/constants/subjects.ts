import { Subject } from "@prisma/client";

export const SUBJECTS = [
  { id: "Quant", label: "Quantitative Aptitude", icon: "📐", color: "blue" },
  { id: "Reasoning", label: "Logical Reasoning", icon: "🧩", color: "purple" },
  { id: "English", label: "English Language", icon: "✍️", color: "emerald" },
  { id: "GA", label: "General Awareness", icon: "🌍", color: "amber" },
  { id: "Computer", label: "Computer Awareness", icon: "💻", color: "cyan" },
] as const;

export type SubjectId = typeof SUBJECTS[number]["id"];

export const SUBJECT_BY_ID = SUBJECTS.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {} as Record<SubjectId, (typeof SUBJECTS)[number]>);

/**
 * Prisma Subject -> UI SubjectId
 */
export const SUBJECT_LOOKUP: Record<Subject, SubjectId> = {
  [Subject.QUANTITATIVE_APTITUDE]: "Quant",
  [Subject.REASONING_ABILITY]: "Reasoning",
  [Subject.ENGLISH_LANGUAGE]: "English",
  [Subject.GENERAL_AWARENESS]: "GA",
  [Subject.COMPUTER_AWARENESS]: "Computer",
};

/**
 * Badge styling
 */
export const SUBJECT_BADGE_CLASSES: Record<SubjectId, string> = {
  Quant: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Reasoning: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  English: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  GA: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Computer: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};
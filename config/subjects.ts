import { Subject } from "@prisma/client";

export const SUBJECT_LABELS: Record<Subject, string> = {
  [Subject.QUANTITATIVE_APTITUDE]: "Quantitative Aptitude",
  [Subject.REASONING_ABILITY]: "Reasoning Ability",
  [Subject.ENGLISH_LANGUAGE]: "English Language",
  [Subject.GENERAL_AWARENESS]: "General Awareness",
  [Subject.COMPUTER_AWARENESS]: "Computer Awareness",
};

export const SUBJECT_MAP: Record<string, Subject> = {
  // UI labels
  "Quantitative Aptitude": Subject.QUANTITATIVE_APTITUDE,
  "Reasoning Ability": Subject.REASONING_ABILITY,
  "English Language": Subject.ENGLISH_LANGUAGE,
  "General Awareness": Subject.GENERAL_AWARENESS,
  "Computer Awareness": Subject.COMPUTER_AWARENESS,

  // Short names
  Quant: Subject.QUANTITATIVE_APTITUDE,
  Reasoning: Subject.REASONING_ABILITY,
  English: Subject.ENGLISH_LANGUAGE,
  GA: Subject.GENERAL_AWARENESS,
  Computer: Subject.COMPUTER_AWARENESS,
};
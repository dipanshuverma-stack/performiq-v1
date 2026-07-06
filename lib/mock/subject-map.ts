import { Subject } from "@prisma/client";

export const SUBJECT_MAP: Record<string, Subject> = {
  Reasoning: Subject.REASONING_ABILITY,
  Quant: Subject.QUANTITATIVE_APTITUDE,
  English: Subject.ENGLISH_LANGUAGE,
  GA: Subject.GENERAL_AWARENESS,
  Computer: Subject.COMPUTER_AWARENESS,
};
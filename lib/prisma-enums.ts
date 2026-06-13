import {
  Subject,
  ExamType,
  Difficulty,
  MockType,
  RevisionStatus,
  MistakeType,
} from "@prisma/client";

export const asSubject = (v: string) => v as Subject;

export const asExamType = (v: string) => v as ExamType;

export const asDifficulty = (v: string) => v as Difficulty;

export const asMockType = (v: string) => v as MockType;

export const asRevisionStatus = (v: string) =>
  v as RevisionStatus;

export const asMistakeType = (v: string) =>
  v as MistakeType;
import {
  Subject,
  ExamType,
  Difficulty,
  MockType,
  RevisionStatus,
  MistakeType,
} from "@prisma/client";

/**
 * Safe type assertions for Prisma enums.
 * Use these when converting string values from forms or API.
 */

export const asSubject = (value: string): Subject => value as Subject;

export const asExamType = (value: string): ExamType => value as ExamType;

export const asDifficulty = (value: string): Difficulty => value as Difficulty;

export const asMockType = (value: string): MockType => value as MockType;

export const asRevisionStatus = (value: string): RevisionStatus => value as RevisionStatus;

export const asMistakeType = (value: string): MistakeType => value as MistakeType;

// Optional: Helper to assert any Prisma enum
export const asPrismaEnum = <T extends string>(value: string, _enum: T[]): T => value as T;
import { z } from "zod";
import { Subject, Difficulty, RevisionStatus } from "@prisma/client"; 
// ✅ Fixed: Unused DIFFICULTY_VALUES and REVISION_STATUS_VALUES imports removed completely

export const PracticeSessionSchema = z
  .object({
    // ✅ Fixed: Enforces direct validation against the core Prisma Subject enum tokens
    subject: z.nativeEnum(Subject),
    topic: z.string().min(1),

    totalQuestions: z.coerce.number().int().positive(),
    correctQuestions: z.coerce.number().int().nonnegative(),
    durationSeconds: z.coerce.number().int().positive(),

    // ✅ Fixed: Refactored to map directly to backend database Difficulty enums
    difficulty: z.nativeEnum(Difficulty).optional(),

    notes: z.string().max(1000).optional(),
    confidenceScore: z.coerce.number().int().min(1).max(5).optional(),

    // ✅ Fixed: Replaced arbitrary text check with native RevisionStatus validation
    revisionStatus: z.nativeEnum(RevisionStatus).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correctQuestions > data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correct"],
        message: "correctQuestions questions cannot exceed total questions",
      });
    }
  });

export type PracticeSessionInput = z.infer<
  typeof PracticeSessionSchema
>;
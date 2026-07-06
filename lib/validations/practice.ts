import { z } from "zod";
import { Subject, Difficulty, RevisionStatus } from "@prisma/client";

export const PracticeSessionSchema = z
  .object({
    subject: z.nativeEnum(Subject),
    topic: z.string().min(1, "Topic is required"),

    totalQuestions: z.coerce.number().int().positive("Total questions must be positive"),
    correctQuestions: z.coerce.number().int().nonnegative("Correct questions cannot be negative"),
    durationSeconds: z.coerce.number().int().positive("Duration must be positive"),

    difficulty: z.nativeEnum(Difficulty).optional().default("MIXED"),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
    confidenceScore: z.coerce.number().int().min(1).max(5).optional(),

    revisionStatus: z.nativeEnum(RevisionStatus).optional().default("UNRESOLVED"),
  })
  .superRefine((data, ctx) => {
    if (data.correctQuestions > data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctQuestions"],
        message: "Correct questions cannot exceed total questions",
      });
    }
  });

export type PracticeSessionInput = z.infer<typeof PracticeSessionSchema>;
import { z } from "zod";
import {
  DIFFICULTY_VALUES,
  REVISION_STATUS_VALUES,
} from "@/lib/constants/practice";

export const PracticeSessionSchema = z
  .object({
    subject: z.string().min(1),
    topic: z.string().min(1),

    totalQuestions: z.coerce.number().int().positive(),

    correctQuestions: z.coerce.number().int().nonnegative(),

    durationSeconds: z.coerce.number().int().positive(),

    difficulty: z.enum(DIFFICULTY_VALUES).optional(),

    notes: z.string().max(1000).optional(),

    confidenceScore: z.coerce.number().int().min(1).max(5).optional(),

    revisionStatus: z.enum(REVISION_STATUS_VALUES).optional(),
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

export type PracticeSessionInput = z.infer<
  typeof PracticeSessionSchema
>;
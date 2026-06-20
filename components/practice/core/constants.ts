import { Subject } from "@prisma/client";

/**
 * Valid runtime subjects restricted to the active operational UI paths.
 */
export const ALLOWED_SUBJECTS = [
  Subject.QUANTITATIVE_APTITUDE,
  Subject.REASONING_ABILITY,
] as const;


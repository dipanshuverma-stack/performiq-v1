import { Subject, Difficulty } from "@prisma/client";

export const ALLOWED_SUBJECTS = [
  Subject.QUANTITATIVE_APTITUDE,
  Subject.REASONING_ABILITY,
] as const;

const SUBJECT_BASE_PACE: Partial<Record<Subject, number>> = {
  [Subject.QUANTITATIVE_APTITUDE]: 1.9,
  [Subject.REASONING_ABILITY]: 1.7,
};

const DIFFICULTY_MODIFIER: Partial<Record<Difficulty, number>> = {
  [Difficulty.EASY]: 0.4,
  [Difficulty.MIXED]: 0,
  [Difficulty.MAINS]: -0.4,
};

export const TOPIC_BENCHMARKS: Record<string, Partial<Record<Difficulty, number>>> = {
  "Simplification": { EASY: 4.0, MIXED: 3.5, MAINS: 2.8 },
  "Quadratic Equations": { EASY: 3.2, MIXED: 2.8, MAINS: 2.0 },
  "Number Series": { EASY: 2.6, MIXED: 2.2, MAINS: 1.6 },
  "Data Interpretation": { EASY: 2.0, MIXED: 1.6, MAINS: 1.1 },
  "Arithmetic Word Problems": { EASY: 1.6, MIXED: 1.2, MAINS: 0.8 },
  "Puzzles": { EASY: 0.9, MIXED: 0.6, MAINS: 0.4 },
  "Seating Arrangement": { EASY: 0.8, MIXED: 0.5, MAINS: 0.3 },
  "Syllogism": { EASY: 3.0, MIXED: 2.5, MAINS: 1.8 },
  "Blood Relation": { EASY: 2.2, MIXED: 1.8, MAINS: 1.2 },
};

interface TargetPaceContext {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  accuracy?: number;
}

/**
 * Resolves context-aware target pacing metrics.
 */
export function getTargetPace({
  subject,
  topic,
  difficulty,
  accuracy,
}: TargetPaceContext): number {
  let basePace = (SUBJECT_BASE_PACE[subject] ?? 1.7) + (DIFFICULTY_MODIFIER[difficulty] ?? 0);

  const normalizedTopic = topic.toLowerCase();

  for (const [key, benchmark] of Object.entries(TOPIC_BENCHMARKS)) {
    const normalizedKey = key.toLowerCase();
    if (normalizedTopic.includes(normalizedKey) || normalizedKey.includes(normalizedTopic)) {
      basePace = benchmark[difficulty] ?? basePace;
      break;
    }
  }

  let target = basePace;

  if (accuracy !== undefined) {
    if (accuracy >= 95) target *= 1.15;
    else if (accuracy <= 60) target *= 0.85;
  }

  return Math.round(target * 100) / 100; // Clean rounding
}
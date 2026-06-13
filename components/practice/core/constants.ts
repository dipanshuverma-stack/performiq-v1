import { Subject, Difficulty } from "@prisma/client";

export const ALLOWED_SUBJECTS = [Subject.QUANTITATIVE_APTITUDE, Subject.REASONING_ABILITY] as const;

// ✅ Architecture Upgraded: Using Partial ensures we don't have to over-specify every combination
export const TOPIC_BENCHMARKS: Record<string, Partial<Record<Difficulty, number>>> = {
  "Simplification": { EASY: 4.0, MIXED: 3.5, MAINS: 2.8 },
  "Quadratic Equations": { EASY: 3.2, MIXED: 2.8, MAINS: 2.0 },
  "Number Series": { EASY: 2.6, MIXED: 2.2, MAINS: 1.6 },
  "Data Interpretation": { EASY: 2.0, MIXED: 1.6, MAINS: 1.1 },
  "Arithmetic Word Problems": { EASY: 1.6, MIXED: 1.2, MAINS: 0.8 },
  "Puzzles": { EASY: 0.9, MIXED: 0.6, MAINS: 0.4 },
  "Seating Arrangement": { EASY: 0.8, MIXED: 0.5, MAINS: 0.3 },
  "Syllogism": { EASY: 3.0, MIXED: 2.5, MAINS: 1.8 },
  "Blood Relation": { EASY: 2.2, MIXED: 1.8, MAINS: 1.2 }
};

export function getTargetPace(subject: Subject, topic: string, difficulty: Difficulty): number {
  // Pre-calculate the absolute fallback context baseline
  let fallbackBase = subject === Subject.QUANTITATIVE_APTITUDE ? 1.9 : 1.7;
  if (difficulty === Difficulty.EASY) fallbackBase += 0.4;
  if (difficulty === Difficulty.MAINS) fallbackBase -= 0.4;

  const matchingKey = Object.keys(TOPIC_BENCHMARKS).find(
    (key) => topic.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(topic.toLowerCase())
  );
  
  // ✅ Architecture Upgraded: Bulletproof optional check with nullish fallback to computed baseline
  if (matchingKey) {
    return TOPIC_BENCHMARKS[matchingKey]?.[difficulty] ?? fallbackBase;
  }
  
  return fallbackBase;
}
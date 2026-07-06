// lib/mock/mock-calculator.ts

export interface TopicPerformance {
  id: string;
  topic: string;
  score: number;
  questions: number;
  correct: number;
  incorrect: number;
}

export interface SubjectTotals {
  score: number;
  questions: number;
  correct: number;
  incorrect: number;
  attempted: number;
  accuracy: number;
}

export interface MockTotals {
  score: number;
  questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
}

export function calculateSubjectTotals(
  topics: TopicPerformance[],
  subjectScore: number
): SubjectTotals {
  const questions = topics.reduce((sum, t) => sum + t.questions, 0);

  const correct = topics.reduce((sum, t) => sum + t.correct, 0);

  const incorrect = topics.reduce((sum, t) => sum + t.incorrect, 0);

  const attempted = correct + incorrect;

  const accuracy =
    attempted === 0
      ? 0
      : Number(((correct / attempted) * 100).toFixed(2));

  return {
    score: subjectScore,
    questions,
    correct,
    incorrect,
    attempted,
    accuracy,
  };
}

export function calculateMockTotals(
  subjects: SubjectTotals[]
): MockTotals {
  const score = subjects.reduce((sum, s) => sum + s.score, 0);

  const questions = subjects.reduce(
    (sum, s) => sum + s.questions,
    0
  );

  const correct = subjects.reduce(
    (sum, s) => sum + s.correct,
    0
  );

  const incorrect = subjects.reduce(
    (sum, s) => sum + s.incorrect,
    0
  );

  const attempted = correct + incorrect;

  const unattempted = Math.max(0, questions - attempted);

  const accuracy =
    attempted === 0
      ? 0
      : Number(((correct / attempted) * 100).toFixed(2));

  return {
    score,
    questions,
    attempted,
    correct,
    incorrect,
    unattempted,
    accuracy,
  };
}

export function validateSubject(
  subject: SubjectTotals
): string[] {
  const errors: string[] = [];

  if (subject.correct < 0)
    errors.push("Correct answers cannot be negative.");

  if (subject.incorrect < 0)
    errors.push("Incorrect answers cannot be negative.");

  if (subject.questions < 0)
    errors.push("Questions cannot be negative.");

  if (subject.correct + subject.incorrect > subject.questions)
    errors.push(
      "Correct + Incorrect exceeds total questions."
    );

  return errors;
}

export function validateMock(
  mock: MockTotals
): string[] {
  const errors: string[] = [];

  if (mock.correct + mock.incorrect > mock.questions)
    errors.push(
      "Attempted questions exceed total questions."
    );

  if (mock.unattempted < 0)
    errors.push(
      "Unattempted questions cannot be negative."
    );

  if (mock.score < 0)
    errors.push(
      "Score cannot be negative."
    );

  return errors;
}
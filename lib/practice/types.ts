import { Subject, Difficulty } from "@prisma/client";

export type PracticePhase =
  | "setup"
  | "running"
  | "paused"
  | "review"
  | "success";

export type TimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "finished";

export type PracticeDifficulty =
  | "EASY"
  | "MIXED"
  | "MAINS";

export interface SessionSnapshot {
  status: TimerStatus;
  elapsedMs: number;
}

export interface TimerEvents {
  tick: SessionSnapshot;
  start: SessionSnapshot;
  pause: SessionSnapshot;
  resume: SessionSnapshot;
  reset: SessionSnapshot;
  finish: SessionSnapshot;
}

export interface QuestionAttempt {
  result: "correct" | "incorrect";
  timestamp: number;
  elapsedMs: number;
  difficulty: PracticeDifficulty;
}

export interface PracticeSession {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  attempts: QuestionAttempt[];
  logQuestion: (result: "correct" | "incorrect") => void;
  undoLastQuestion: () => void;
  pause: () => void;
  resume: () => void;
  finishSession: () => void;
}
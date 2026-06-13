import { syllabus } from "@/config/syllabus";

export type PracticePhase = "setup" | "running" | "paused" | "review" | "success";
export type PracticeDifficulty = "Easy" | "Mixed ⭐" | "Mains";

export type TimerStatus = "idle" | "running" | "paused" | "stopped" | string;

export interface SessionSnapshot {
  status: string;
  elapsedMs: number;
  [key: string]: any;
}

export interface TimerEvents {
  [key: string]: any;
}

export interface QuestionAttempt {
  result: "correct" | "incorrectQuestions";
  timestamp: number;
  elapsedMs: number;
  difficulty: PracticeDifficulty;
}

export interface HistoricalSession {
  id: string;
  subject: keyof typeof syllabus;
  topic: string;
  difficulty: PracticeDifficulty;
  correctQuestions: number;
  incorrectQuestions: number;
  pace: number; 
  avgSecPerQ: number;
  dateStr: string;
  notes?: string; // 💡 Added to retain observations
}
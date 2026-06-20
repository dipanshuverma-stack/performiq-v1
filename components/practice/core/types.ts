import { syllabus } from "@/config/syllabus";
import { PracticeDifficulty } from "@/lib/practice/types";

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
  notes?: string;
}
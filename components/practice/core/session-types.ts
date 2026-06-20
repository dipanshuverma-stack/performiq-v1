import { Subject } from "@prisma/client";

export interface PracticeSessionData {
  id: string;
  subject: Subject;
  topic: string;
  durationSeconds: number;
  accuracy: number;
  createdAt: Date;
  attemptsCount: number;
}
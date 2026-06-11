export type TimerStatus = "idle" | "running" | "paused";

export interface SessionSnapshot {
  version: 1;
  sessionId: string;
  status: TimerStatus;
  elapsedMs: number;
  startedAt: number | null;
  pausedDurationMs: number;
  lastUpdatedAt: number;
}

export interface TimerEvents {
  start: SessionSnapshot;
  pause: SessionSnapshot;
  resume: SessionSnapshot;
  tick: SessionSnapshot;
  finish: SessionSnapshot;
  reset: SessionSnapshot;
}
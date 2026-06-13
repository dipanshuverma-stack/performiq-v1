import { PracticeDifficulty } from "@/components/practice/core/types"; // Adjust path to where your types live

export interface RawSessionData {
  correctQuestionsCount: number;
  incorrectQuestionsCount: number;
  elapsedMs: number;
  difficulty: PracticeDifficulty;
}

export interface LiveMetricsProfile {
  accuracy: number;
  attempted: number;
  correctQuestions: number;
  incorrectQuestions: number;
  currentPace: number;
  targetPace: number;
  paceStatus: "▲ On Track" | "▼ Behind" | "— Stabilizing";
  performanceDelta: string;
}

// Strictly typed to guarantee compiler safety if difficulties change
const TARGET_PACE_MAP: Record<PracticeDifficulty, number> = {
  "Easy": 2.2,
  "Mixed ⭐": 1.8,
  "Mains": 1.1, // Aligned with your earlier established type names
};

/**
 * Derives explicit, history-aligned practice metrics from active session frames.
 */
export function calculateLiveMetrics({ correctQuestionsCount, incorrectQuestionsCount, elapsedMs, difficulty }: RawSessionData): LiveMetricsProfile {
  const attempted = correctQuestionsCount + incorrectQuestionsCount;
  const minutes = elapsedMs / 60000;
  
  // Core Accuracy
  const accuracy = attempted > 0 ? Math.round((correctQuestionsCount / attempted) * 100) : 100;

  // Real-Time Pacing Velocity
  // Requires at least 15 seconds (0.25 mins) or 2 attempts to pass the stabilization window
  const isStabilized = minutes > 0.25 || attempted >= 2;
  const currentPace = isStabilized ? attempted / minutes : 0;
  
  const targetPace = TARGET_PACE_MAP[difficulty] || 1.8;

  // Status Evaluation
  let paceStatus: LiveMetricsProfile["paceStatus"] = "— Stabilizing";
  if (isStabilized) {
    paceStatus = currentPace >= targetPace ? "▲ On Track" : "▼ Behind";
  }

  // Relative Performance Comparison
  const baseDelta = currentPace > 0 
    ? Math.round(((currentPace - targetPace) / targetPace) * 100) 
    : 0;
  
  const performanceDelta = isStabilized
    ? `${baseDelta >= 0 ? "+" : ""}${baseDelta}% vs Target` 
    : "Calibrating...";

  return {
    accuracy,
    attempted,
    correctQuestions: correctQuestionsCount,
    incorrectQuestions: incorrectQuestionsCount,
    currentPace: Number(currentPace.toFixed(2)),
    targetPace,
    paceStatus,
    performanceDelta
  };
}

/**
 * Formats milliseconds cleanly into standard, high-legibility stopwatch displays.
 * Dynamically hides hours if under 60 minutes for a cleaner UI.
 */
export function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  return `${pad(minutes)}:${pad(seconds)}`;
}
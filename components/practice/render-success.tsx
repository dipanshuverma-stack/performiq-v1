import React from "react";
import { PracticeSuccess } from "./practice-success";

interface RenderSuccessProps {
  session: any;
  snapshot: { elapsedMs: number };
  metrics: { total: number; accuracy: number; pace: number; streak: number };
}

export function RenderSuccess({ session, snapshot, metrics }: RenderSuccessProps) {
  return (
    <PracticeSuccess
      accuracy={metrics.accuracy}
      currentPace={metrics.pace}
      avgTimeStr={
        metrics.total > 0
          ? `${Math.round(snapshot.elapsedMs / metrics.total / 1000)}s`
          : "0s"
      }
      bestStreak={metrics.streak}
      onRepeat={session.resetToDashboard}
      onExit={session.resetToDashboard}
    />
  );
}
import React from "react";
import { PracticeMetrics } from "./practice-metrics";
import { PracticeControls } from "./practice-controls";

interface RenderRunningProps {
  session: any;
  snapshot: { status: string; elapsedMs: number };
  metrics: { total: number; correctQuestions: number; incorrectQuestions: number; accuracy: number; pace: number; streak: number };
  isPaused?: boolean;
}

export function RenderRunning({ session, snapshot, metrics, isPaused = false }: RenderRunningProps) {
  return (
    <div className={`space-y-6 ${isPaused ? "opacity-75 pointer-events-none select-none" : ""}`}>
      <PracticeMetrics
        attempted={metrics.total}
        correctQuestions={metrics.correctQuestions}
        incorrectQuestions={metrics.incorrectQuestions}
        accuracy={metrics.accuracy}
        currentPace={metrics.pace}
        targetPace={20} 
        avgTimeStr={
          metrics.total > 0
            ? `${Math.round(snapshot.elapsedMs / metrics.total / 1000)}s`
            : "0s"
        }
        bestStreak={metrics.streak}
      />

      <PracticeControls
        oncorrectQuestions={() => session.logQuestion("correct")}
        onincorrectQuestions={() => session.logQuestion("incorrectQuestions")}
        onUndo={session.undoLastQuestion}
        hasAttempts={session.attempts.length > 0}
        status={snapshot.status}
        onPause={session.pause} // Handled dynamically in parent
        onResume={session.resume}
        onFinish={session.endTrackingRun}
      />
    </div>
  );
}
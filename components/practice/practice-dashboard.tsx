"use client";

import React from "react";
import { Subject } from "@prisma/client";
import { PracticePhase } from "./core/types";
import { useSessionRuntime } from "@/lib/core/session-runtime/useSessionRuntime";
import { usePracticeSession } from "./core/hooks/usePracticeSession";
import { calculateMetrics } from "@/lib/practice/metrics";
import { formatTime } from "@/lib/core/session-timer/utils";
import { syllabus } from "@/config/syllabus";

import { PracticeHeader } from "./practice-header";
import RecentPracticeHistory, {
  PracticeSessionData,
} from "./recent-practice-history";
import { RenderSetup } from "./render-setup";
import { RenderRunning } from "./render-running";
import { RenderReview } from "./render-review";
import { RenderSuccess } from "./render-success";

interface PracticeDashboardProps {
  recentSessions: PracticeSessionData[];
}

export function PracticeDashboard({
  recentSessions,
}: PracticeDashboardProps) {
  const sessionId = "performiq-prod-v2";

  const {
    snapshot,
    start,
    pause,
    resume,
    reset,
    finish,
  } = useSessionRuntime(sessionId);

  const session = usePracticeSession(
    sessionId,
    Subject.QUANTITATIVE_APTITUDE,
    syllabus[Subject.QUANTITATIVE_APTITUDE][0],
    snapshot,
    start,
    pause,
    reset,
    finish
  );

  // 1. Fetch raw computed analytics metrics from engine
  const rawMetrics = calculateMetrics(
    session.attempts,
    snapshot.elapsedMs
  );

  // 2. Inline map keys to match component-level prop contracts exactly
  const metrics = {
    total: rawMetrics.total,
    correctQuestions: rawMetrics.correct,
    incorrectQuestions: rawMetrics.wrong,
    accuracy: rawMetrics.accuracy,
    pace: rawMetrics.pace,
    streak: rawMetrics.streak,
  };

  const controlSession = {
    ...session,
    pause,
    resume,
  };

  const phaseView: Record<PracticePhase, React.ReactNode> = {
    setup: <RenderSetup session={controlSession} />,
    running: (
      <RenderRunning
        session={controlSession}
        snapshot={snapshot}
        metrics={metrics}
      />
    ),
    paused: (
      <RenderRunning
        session={controlSession}
        snapshot={snapshot}
        metrics={metrics}
        isPaused
      />
    ),
    review: (
      <RenderReview
        session={controlSession}
        metrics={metrics}
      />
    ),
    success: (
      <RenderSuccess
        session={controlSession}
        snapshot={snapshot}
        metrics={metrics}
      />
    ),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen text-zinc-100 flex flex-col items-center justify-center space-y-6">
      <PracticeHeader
        topic={
          session.phase === "setup"
            ? "Practice Session"
            : session.topic
        }
        questionsPracticed={session.attempts.length}
        timeRemaining={formatTime(snapshot.elapsedMs)}
        isBehindPace={metrics.pace < 20}
      />

      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-xl min-h-[450px]">
        {phaseView[session.phase]}
      </div>

      {session.phase === "setup" && (
        <div className="w-full max-w-xl animate-in fade-in duration-300">
          <RecentPracticeHistory sessions={recentSessions} />
        </div>
      )}
    </div>
  );
}
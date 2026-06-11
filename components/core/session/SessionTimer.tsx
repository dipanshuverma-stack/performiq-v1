"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useSessionRuntime } from "@/lib/core/session-runtime/useSessionRuntime";
import { SessionTimerDisplay } from "./SessionTimerDisplay";
import { SessionTimerControls } from "./SessionTimerControls";

export interface SessionTimerRef {
  finish: () => number;
  reset: () => void;
}

interface SessionTimerProps {
  sessionId: string;
  disabled?: boolean;
}

export const SessionTimer = forwardRef<SessionTimerRef, SessionTimerProps>(
  ({ sessionId, disabled = false }, ref) => {
    const { snapshot, start, pause, resume, reset, finish } = useSessionRuntime(sessionId);

    useImperativeHandle(ref, () => ({
      finish,
      reset,
    }));

    return (
      <div className="space-y-4">
        {/* Math is hidden here; the display tier never sees elapsedMs */}
        <SessionTimerDisplay elapsedSeconds={Math.floor(snapshot.elapsedMs / 1000)} />
        
        <SessionTimerControls
          status={snapshot.status}
          disabled={disabled}
          onStart={start}
          onPause={pause}
          onResume={resume}
          onReset={reset}
        />
      </div>
    );
  }
);

SessionTimer.displayName = "SessionTimer";
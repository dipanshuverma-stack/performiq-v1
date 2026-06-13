"use client";

import { useEffect, useRef, useSyncExternalStore, useCallback } from "react";
import { SessionRuntime } from "./SessionRuntime";

export function useSessionRuntime(sessionId: string) {
  // ✅ Instanced via useRef to entirely isolate the engine container from React's state scheduler
  const runtimeRef = useRef<SessionRuntime | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new SessionRuntime(sessionId);
  }

  const runtime = runtimeRef.current;

  // ✅ Connect store cleanly to the event bus emitter with ZERO hidden rendering hooks
  const snapshot = useSyncExternalStore(
    (notify) => {
      const unsubscribers = [
        runtime.events.on("tick", notify),
        runtime.events.on("start", notify),
        runtime.events.on("pause", notify),
        runtime.events.on("resume", notify),
        runtime.events.on("reset", notify),
        runtime.events.on("finish", notify),
      ];

      return () => unsubscribers.forEach((u) => u());
    },
    () => runtime.timer.getSnapshot(), // Returns reference-cached snapshot object
    () => runtime.timer.getSnapshot()
  );

  // ✅ Deterministic resource teardown on absolute component unmount
  useEffect(() => {
    return () => {
      runtime.destroy();
    };
  }, [runtime]);

  // ✅ Reference-stable action delegates matching the updated TimerEngine signatures
  return {
    snapshot,
    start: useCallback(() => runtime.timer.start(), [runtime]),
    pause: useCallback(() => runtime.timer.pause(), [runtime]),
    resume: useCallback(() => runtime.timer.resume(), [runtime]), // Targeted to Option A explicit method
    reset: useCallback(() => runtime.timer.reset(), [runtime]),
    finish: useCallback(() => {
      const snap = runtime.timer.finish();
      return Math.floor(snap.elapsedMs / 1000);
    }, [runtime]),
  };
}
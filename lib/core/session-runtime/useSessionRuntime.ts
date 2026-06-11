"use client";

import { useEffect, useMemo, useSyncExternalStore, useCallback } from "react";
import { SessionRuntime } from "./SessionRuntime";

export function useSessionRuntime(sessionId: string) {
  // Memoize runtime container assignment to maintain stability during re-renders
  const runtime = useMemo(() => new SessionRuntime(sessionId), [sessionId]);

  // Subscribe React cleanly to external mutable engine fields via React 18+ standard
  const snapshot = useSyncExternalStore(
    (notifyReact) => {
      const disconnectListeners = [
        runtime.events.on("tick", notifyReact),
        runtime.events.on("start", notifyReact),
        runtime.events.on("pause", notifyReact),
        runtime.events.on("resume", notifyReact),
        runtime.events.on("reset", notifyReact),
        runtime.events.on("finish", notifyReact),
      ];
      return () => disconnectListeners.forEach((unsub) => unsub());
    },
    () => runtime.timer.getSnapshot(), // Client-side hydration data snapshot tree
    () => runtime.timer.getSnapshot()  // Server-side hydration placeholder structure
  );

  // Safely wrap methods to preserve the 'this' context of the internal class instances
  const start = useCallback(() => {
    runtime.timer.start();
  }, [runtime]);

  const pause = useCallback(() => {
    runtime.timer.pause();
  }, [runtime]);

  const resume = useCallback(() => {
    runtime.timer.resume();
  }, [runtime]);

  const reset = useCallback(() => {
    runtime.timer.reset();
  }, [runtime]);

  // Intercepts and immediately abstracts milliseconds into whole duration seconds
  const finish = useCallback(() => {
    const finalSnapshot = runtime.timer.finish();
    return Math.floor(finalSnapshot.elapsedMs / 1000);
  }, [runtime]);

  // Structural teardown on component unmount
  useEffect(() => {
    return () => runtime.destroy();
  }, [runtime]);

  return {
    snapshot,
    start,
    pause,
    resume,
    reset,
    finish,
  };
}
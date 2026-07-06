"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function usePracticeTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "finished">("idle");

  const startRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (status !== "idle") return;

    startRef.current = Date.now();
    setStatus("running");

    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 1000);
  }, [status]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (status !== "paused") return;

    startRef.current = Date.now() - elapsedMs;
    setStatus("running");

    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 1000);
  }, [status, elapsedMs]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedMs(0);
    setStatus("idle");
  }, []);

  const finish = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("finished");
    return elapsedMs;
  }, [elapsedMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    elapsedMs,
    status,
    isPaused: status === "paused",
    start,
    pause,
    resume,
    reset,
    finish,
  };
}
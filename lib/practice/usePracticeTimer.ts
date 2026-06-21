"use client";

import { useState, useEffect, useRef } from "react";

export function usePracticeTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "running" | "paused" | "finished"
  >("idle");

  const startRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (status !== "idle") return;

    startRef.current = Date.now();
    setStatus("running");

    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("paused");
  };

  const resume = () => {
    startRef.current = Date.now() - elapsedMs;
    setStatus("running");

    intervalRef.current = setInterval(() => {
      const value = Date.now() - startRef.current;
      console.log("HOOK TIMER:", value);
      setElapsedMs(value);
    }, 1000);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsedMs(0);
    setStatus("idle");
  };

  const finish = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("finished");
    return elapsedMs;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
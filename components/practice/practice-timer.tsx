"use client";

import { useEffect, useState } from "react";

interface PracticeTimerProps {
  onTimeUpdate: (seconds: number) => void;
  resetSignal: number;
}

export default function PracticeTimer({
  onTimeUpdate,
  resetSignal,
}: PracticeTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Core ticking mechanism loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  // Sync state upward into parent layout wrapper instance data payload
  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  // 🔄 Listen for parent form save completion to reset state metrics
  useEffect(() => {
    if (resetSignal > 0) {
      setRunning(false);
      setSeconds(0);
      onTimeUpdate(0);
    }
  }, [resetSignal, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hrs
      .toString()
      .padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-500">
          Timer
        </p>

        <p className="text-5xl font-bold mt-2 font-mono">
          {formatTime(seconds)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Start
        </button>

        <button
          type="button"
          onClick={() => setRunning(false)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Pause
        </button>

        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSeconds(0);
            onTimeUpdate(0);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
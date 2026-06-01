"use client";

import { useEffect, useState } from "react";

export default function PracticeTimer({
  onTimeUpdate,
}: {
  onTimeUpdate: (seconds: number) => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
  let interval: NodeJS.Timeout;

  if (running) {
    interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [running]);

useEffect(() => {
  onTimeUpdate(seconds);
}, [seconds, onTimeUpdate]);

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

        <p className="text-5xl font-bold mt-2">
          {formatTime(seconds)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Start
        </button>

        <button
          type="button"
          onClick={() => setRunning(false)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
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
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
"use client";

import { TimerStatus } from "@/components/practice/core/types";

interface SessionTimerControlsProps {
  status: TimerStatus;
  disabled?: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function SessionTimerControls({
  status,
  disabled = false,
  onStart,
  onPause,
  onResume,
  onReset,
}: SessionTimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {status === "idle" && (
        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Start Session
        </button>
      )}

      {status === "running" && (
        <button
          type="button"
          onClick={onPause}
          disabled={disabled}
          className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Pause
        </button>
      )}

      {status === "paused" && (
        <button
          type="button"
          onClick={onResume}
          disabled={disabled}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Resume
        </button>
      )}

      <button
        type="button"
        onClick={onReset}
        disabled={disabled || status === "idle"}
        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-colors border border-gray-200"
      >
        Reset
      </button>
    </div>
  );
}
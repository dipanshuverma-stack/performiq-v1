"use client";

import React from "react";

interface PracticeHeaderProps {
  topic: string;
  questionsPracticed: number;
  timeRemaining: string;
  isBehindPace?: boolean;
}

export function PracticeHeader({
  topic,
  questionsPracticed,
  timeRemaining,
  isBehindPace = false,
}: PracticeHeaderProps) {
  return (
    <div className="w-full max-w-xl flex items-center justify-between border-b border-zinc-900 pb-4 text-sm text-zinc-400">
      {/* Left: Interactive Context */}
      <div className="flex-1">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">{topic}</h1>
        <p className="text-xs text-slate-500 tracking-wide uppercase mt-0.5">
          Continuous Engine v2
        </p>
      </div>

      {/* Center: Premium Operating System Styled Telemetry Pill */}
      <div className="flex-1 flex justify-center">
        <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-medium text-slate-400">
          <span className="text-slate-200 font-semibold">
            {questionsPracticed}
          </span>{" "}
          Questions Practiced
        </div>
      </div>

      {/* Right: Pace Runtime Metrics */}
      <div className="flex-1 text-right">
        <p className={`font-mono text-xl font-bold tracking-tabular ${isBehindPace ? "text-amber-500" : "text-zinc-100"}`}>
          {timeRemaining}
        </p>
        <p className="text-[10px] text-zinc-500 tracking-wider uppercase mt-0.5">
          Elapsed Time
        </p>
      </div>
    </div>
  );
}
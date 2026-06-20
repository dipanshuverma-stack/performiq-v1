"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  // Deterministic mount tracking line to ensure true server/client HTML parity
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPlaceholder = !topic || topic.trim() === "" || topic === "Practice Session";
  const titleText = isPlaceholder ? "Continuous Practice" : topic;
  const subtitleText = isPlaceholder ? "Ready to begin" : "Live Practice Session";

  return (
    <div className="w-full max-w-xl flex items-center justify-between border-b border-zinc-900 pb-6 text-sm text-zinc-400">
      
      {/* Left: Dynamic Target Context */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight truncate">
          {titleText}
        </h1>
        <p className="text-xs text-slate-400/70 tracking-wide uppercase mt-0.5">
          {subtitleText}
        </p>
      </div>

      {/* Center: High-Emphasis Operational Metrics Pill */}
      <div className="hidden md:flex flex-1 justify-center shrink-0">
        <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-medium text-slate-400/70">
          <span className="text-slate-100 font-bold tabular-nums mr-1">
            {questionsPracticed}
          </span>
          Solved
        </div>
      </div>

      {/* Right: Hydration-Locked Time Evaluation Display */}
      <div className="flex-1 text-right shrink-0 flex flex-col items-end">
        <p
          className={cn(
            "min-w-[72px] text-2xl font-black tabular-nums tracking-tight transition-colors duration-200",
            isBehindPace && mounted ? "text-amber-500" : "text-zinc-100"
          )}
        >
          {/* Guaranteed structural symmetry during the initial layout handshake */}
          {mounted ? timeRemaining : "00:00"}
        </p>
        <p className="text-[10px] text-zinc-500 tracking-wider uppercase mt-0.5">
          {isPlaceholder ? "Target Duration" : "Elapsed Time"}
        </p>
      </div>

    </div>
  );
}
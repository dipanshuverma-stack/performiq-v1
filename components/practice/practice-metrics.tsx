import React from "react";

interface PracticeMetricsProps {
  attempted: number;
  correctQuestions: number;
  incorrectQuestions: number;
  accuracy: number;
  currentPace: number;
  targetPace: number;
  avgTimeStr: string;
  bestStreak: number;
}

export function PracticeMetrics({
  attempted, correctQuestions, incorrectQuestions, accuracy, currentPace, targetPace, avgTimeStr, bestStreak
}: PracticeMetricsProps) {
  const isAhead = currentPace >= targetPace;

  return (
    <div className="space-y-3">
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 flex items-center justify-between font-mono">
        <div>
          <span className="text-[8px] uppercase font-bold tracking-wider text-zinc-500 block font-sans">Pace Status</span>
          <span className={`text-xs font-black flex items-center gap-1 ${isAhead ? "text-emerald-400" : "text-amber-500"}`}>
            {isAhead ? "🟢 Ahead of Target" : "🟡 Below Target Pacing"}
          </span>
        </div>
        <div className="text-right text-[11px] space-y-0.5">
          <div><span className="text-zinc-500">Current:</span> <span className="text-zinc-200 font-bold">{currentPace.toFixed(2)} QPM</span></div>
          <div><span className="text-zinc-500">Target:</span> <span className="text-zinc-400 font-medium">{targetPace.toFixed(1)} QPM</span></div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center font-mono">
        <div className="bg-zinc-950 border border-zinc-900/80 p-2 rounded-xl">
          <span className="text-[8px] text-zinc-500 font-bold block uppercase font-sans">Attempted</span>
          <span className="text-sm font-black text-zinc-200">{attempted}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-900/80 p-2 rounded-xl">
          <span className="text-[8px] text-zinc-500 font-bold block uppercase font-sans">Accuracy</span>
          <span className="text-sm font-black text-blue-400">{accuracy}%</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-900/80 p-2 rounded-xl">
          <span className="text-[8px] text-zinc-500 font-bold block uppercase font-sans">Avg Time</span>
          <span className="text-sm font-black text-purple-400">{avgTimeStr}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-900/80 p-2 rounded-xl">
          <span className="text-[8px] text-zinc-500 font-bold block uppercase font-sans">Best Streak</span>
          <span className="text-sm font-black text-emerald-400">🔥 {bestStreak}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
        <div className="bg-emerald-950/10 border border-emerald-900/30 text-emerald-400 py-1.5 rounded-lg font-bold">
          {correctQuestions} correctQuestions (✓)
        </div>
        <div className="bg-rose-950/10 border border-rose-900/30 text-rose-400 py-1.5 rounded-lg font-bold">
          {incorrectQuestions} incorrectQuestions (✕)
        </div>
      </div>
    </div>
  );
}
import React from "react";

interface PracticeSuccessProps {
  accuracy: number;
  currentPace: number;
  avgTimeStr: string;
  bestStreak: number;
  onRepeat: () => void;
  onExit: () => void;
}

export function PracticeSuccess({ accuracy, currentPace, avgTimeStr, bestStreak, onRepeat, onExit }: PracticeSuccessProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="space-y-1">
        <div className="w-10 h-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 rounded-full flex items-center justify-center text-lg mx-auto mb-1">🏆</div>
        <h2 className="text-sm font-black text-zinc-100 uppercase tracking-wider">Session Saved</h2>
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Performance History Updated</p>
      </div>

      <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-3.5 text-left font-mono text-xs space-y-2">
        <div className="flex justify-between items-center"><span className="text-zinc-500 font-sans">Accuracy Output</span><strong className="text-zinc-200 font-black">{accuracy}%</strong></div>
        <div className="flex justify-between items-center"><span className="text-zinc-500 font-sans">Pacing Score</span><strong className="text-blue-400 font-black">{currentPace.toFixed(2)} QPM</strong></div>
        <div className="flex justify-between items-center"><span className="text-zinc-500 font-sans">Avg Time</span><strong className="text-purple-400 font-black">{avgTimeStr}/question</strong></div>
        <div className="flex justify-between items-center"><span className="text-zinc-500 font-sans">Best correctQuestions Streak</span><strong className="text-emerald-400 font-black">🔥 {bestStreak}</strong></div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
        <button onClick={onRepeat} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow">
          Practice Again
        </button>
        <button onClick={onExit} className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-bold py-2.5 rounded-xl transition-all">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

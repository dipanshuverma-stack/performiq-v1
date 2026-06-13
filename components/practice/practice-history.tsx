import React from "react";
import { HistoricalSession } from "@/components/practice/core/types";

interface PracticeHistoryProps {
  history: HistoricalSession[];
  onHydrate: (session: HistoricalSession) => void;
}

export function PracticeHistory({ history, onHydrate }: PracticeHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-[#141b2d]/40 border border-[#1e2640] border-dashed rounded-xl p-6 text-center space-y-2">
        <span className="text-lg block">📈</span>
        <h4 className="text-xs font-bold text-zinc-400">No practice sessions yet</h4>
        <p className="text-[10px] text-zinc-500 max-w-xs mx-auto font-medium">
          Start your first practice session to build your performance history and analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-zinc-100">
      <div className="flex justify-between items-baseline px-0.5">
        <h3 className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">Recent Practice Sessions</h3>
        <span className="text-[9px] font-mono text-zinc-500 font-medium">Continue where you left off</span>
      </div>

      <div className="bg-[#141b2d] border border-[#1e2640] rounded-xl overflow-hidden divide-y divide-[#1e2640] shadow-xl">
        {history.map((session) => (
          <div key={session.id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#0d121f]/40 transition-colors">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${session.correctQuestions / (session.correctQuestions + session.incorrectQuestions || 1) >= 0.85 ? "bg-[#10b981]" : "bg-amber-500"}`} />
                <h4 className="text-xs font-black text-white truncate">{session.topic}</h4>
                <span className="text-[8px] font-mono px-1 bg-[#0d121f] border border-[#1e2640] text-zinc-400 rounded uppercase shrink-0">
                  {session.difficulty}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 flex-wrap">
                <span className="text-emerald-400 font-bold">{Math.round((session.correctQuestions / (session.correctQuestions + session.incorrectQuestions || 1)) * 100)}% Acc</span>
                <span>•</span>
                <span>{session.correctQuestions}✓ {session.incorrectQuestions}✕</span>
                <span>•</span>
                <span className="text-purple-400">{session.avgSecPerQ}s/Q</span>
                <span>•</span>
                <span className="text-blue-400">{session.pace.toFixed(1)} QPM</span>
              </div>
            </div>
            <button
              onClick={() => onHydrate(session)}
              className="bg-[#0d121f] border border-[#1e2640] hover:border-[#2e3a5f] text-zinc-300 hover:text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-all shrink-0 font-mono"
            >
              Practice Again
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
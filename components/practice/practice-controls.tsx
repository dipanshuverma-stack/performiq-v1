import React from "react";

interface PracticeControlsProps {
  oncorrectQuestions: () => void;
  onincorrectQuestions: () => void;
  onUndo: () => void;
  hasAttempts: boolean;
  status: string;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
}

export function PracticeControls({
  oncorrectQuestions, onincorrectQuestions, onUndo, hasAttempts, status, onPause, onResume, onFinish
}: PracticeControlsProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <button
          onClick={oncorrectQuestions}
          className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-mono font-black transition-all active:scale-95 shadow"
        >
          + correctQuestions (C)
        </button>
        <button
          onClick={onincorrectQuestions}
          className="bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-mono font-black transition-all active:scale-95 shadow"
        >
          + incorrectQuestions (W)
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2 border-t border-zinc-900">
        {hasAttempts && (
          <button
            onClick={onUndo}
            className="text-[10px] font-mono text-zinc-500 hover:text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-md transition-colors"
          >
            ↩ Undo Last Flag (Ctrl+Z)
          </button>
        )}

        <div className="w-full flex justify-between items-center text-[11px] font-mono font-medium text-zinc-500">
          {status === "running" ? (
            <button onClick={onPause} className="hover:text-zinc-300 transition-colors">
              ⏸ Pause (Space / Esc)
            </button>
          ) : (
            <button onClick={onResume} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              ▶ Resume (Space / R)
            </button>
          )}

          <button
            onClick={onFinish}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-black px-4 py-1.5 rounded-lg transition-all text-xs font-sans"
          >
            Finish Session (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
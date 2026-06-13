import React from "react";

interface PracticeReviewProps {
  topic: string;
  accuracy: number;
  currentPace: number;
  notes: string;
  setNotes: (text: string) => void;
  onSave: () => void;
}

export function PracticeReview({ topic, accuracy, currentPace, notes, setNotes, onSave }: PracticeReviewProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
      <div className="text-center border-b border-zinc-900 pb-3">
        <h2 className="text-sm font-black text-zinc-100 uppercase tracking-tight">Session Review</h2>
        <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{topic}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center font-mono text-xs">
        <div className="bg-zinc-900/40 border border-zinc-900 p-2.5 rounded-xl">
          <span className="text-[9px] text-zinc-500 block font-sans">Accuracy Output</span>
          <span className="text-sm font-black text-zinc-200">{accuracy}%</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-900 p-2.5 rounded-xl">
          <span className="text-[9px] text-zinc-500 block font-sans">Pacing Metrics</span>
          <span className="text-sm font-black text-zinc-200">{currentPace.toFixed(2)} QPM</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-400 block font-mono uppercase tracking-wider">Session Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Log key observations, mistakes, or formula concepts to review later..."
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none font-medium leading-relaxed"
        />
      </div>

      <button
        onClick={onSave}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2.5 rounded-xl transition-all uppercase tracking-wider font-mono"
      >
        Save Performance Run
      </button>
    </div>
  );
}

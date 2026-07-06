"use client";

import { useMemo, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectPerformanceCardProps {
  subject: string;
  score: number;
  questions: number;
  correct: number;
  incorrect: number;

  onScoreChange: (value: number) => void;
  onQuestionsChange: (value: number) => void;
  onCorrectChange: (value: number) => void;
  onIncorrectChange: (value: number) => void;

  disabled?: boolean;
  children?: ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onToggle: () => void;
}

export default function SubjectPerformanceCard({
  subject,
  score,
  questions,
  correct,
  incorrect,
  onScoreChange,
  onQuestionsChange,
  onCorrectChange,
  onIncorrectChange,
  disabled = false,
  expandable = false,
  expanded = false,
  children,
  onToggle,
}: SubjectPerformanceCardProps) {
  const { accuracy, attempted, hasInvalidAttempt } = useMemo(() => {
    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    return {
      accuracy,
      attempted,
      hasInvalidAttempt: attempted > questions,
    };
  }, [questions, correct, incorrect]);

  // Base glass control class configuration
  const baseInputClass = "w-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-4 py-3 text-lg font-semibold text-white placeholder:text-slate-500 shadow-inner hover:bg-white/[0.05] hover:border-white/20 transition-all duration-200 focus:bg-white/[0.06] focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.06] bg-[#0B1020]",
        "transition-all duration-300",
        "hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <h3 className="text-lg font-bold">{subject}</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
            Subject Performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Attempted</p>
            <p
              className={cn(
                "text-lg font-bold",
                hasInvalidAttempt ? "text-rose-400" : "text-slate-300"
              )}
            >
              {attempted} / {questions}
            </p>
          </div>
          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Accuracy</p>
            <p className="text-2xl font-black text-indigo-400">{accuracy}%</p>
          </div>
        </div>
      </div>

      {/* Inputs (Premium Glass Controls) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-7">
        {/* Score */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Score
          </label>
          <input 
            type="number" 
            value={score || ""} 
            disabled={disabled} 
            onChange={(e) => onScoreChange(Number(e.target.value) || 0)} 
            className={cn(
              baseInputClass,
              "focus:border-indigo-400/60 focus:ring-indigo-500/20"
            )}
          />
        </div>

        {/* Questions */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Questions
          </label>
          <input 
            type="number" 
            value={questions || ""} 
            disabled={disabled}
            onChange={(e) => onQuestionsChange(Number(e.target.value) || 0)} 
            className={cn(
              baseInputClass,
              "focus:border-indigo-400/60 focus:ring-indigo-500/20"
            )}
          />
        </div>

        {/* Correct */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Correct
          </label>
          <input 
            type="number" 
            value={correct || ""} 
            disabled={disabled}
            onChange={(e) => onCorrectChange(Number(e.target.value) || 0)} 
            className={cn(
              baseInputClass,
              "focus:border-emerald-400/60 focus:ring-emerald-500/20"
            )}
          />
        </div>

        {/* Incorrect */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Incorrect
          </label>
          <input 
            type="number" 
            value={incorrect || ""} 
            disabled={disabled}
            onChange={(e) => onIncorrectChange(Number(e.target.value) || 0)} 
            className={cn(
              baseInputClass,
              "focus:border-rose-400/60 focus:ring-rose-500/20"
            )}
          />
        </div>
      </div>

      {/* Footer / Expansion Section */}
      <div className="border-t border-white/[0.06]">
        <button
          type="button"
          disabled={!expandable}
          className={cn(
            "flex w-full items-center justify-between px-6 py-4 transition-colors",
            expandable ? "hover:bg-white/[0.03]" : "cursor-not-allowed text-slate-500"
          )}
          onClick={onToggle}
        >
          <div className="text-left">
            <p className="text-sm font-medium text-slate-300">Topic Breakdown</p>
            <p className="mt-1 text-xs text-slate-500">
              {expandable ? "Expand to edit topic performance" : "Coming next"}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              expandable && "text-slate-400",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Animated Dropdown Expansion Container */}
        {expandable && children && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              expanded ? "max-h-[2000px] border-t border-white/[0.06]" : "max-h-0"
            )}
          >
            <div className="p-6">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
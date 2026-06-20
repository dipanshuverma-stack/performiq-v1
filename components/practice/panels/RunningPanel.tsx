"use client";

import React from "react";
import { Subject } from "@prisma/client";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { formatTime } from "@/lib/practice/formatters";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardKPICard } from "@/components/ui/kpi-card";
import { FileText, CheckCircle2, XCircle, Target, ArrowRight, RotateCcw } from "lucide-react";

interface RunningPanelProps {
  topic: string;
  subject: Subject;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  currentQpm: number;
  targetQpm: number;
  elapsedMs: number;
  logQuestion: (result: "correct" | "incorrect") => void;
  undoLastQuestion: () => void;
  onPauseAndReview: () => void;
}

export function RunningPanel({
  topic,
  subject,
  attemptsCount,
  correctCount,
  incorrectCount,
  accuracy,
  currentQpm,
  targetQpm,
  elapsedMs,
  logQuestion,
  undoLastQuestion,
  onPauseAndReview,
}: RunningPanelProps) {
  
  const formattedTime = formatTime(elapsedMs);
  const accuracyColorClass = accuracy >= 85 ? "text-emerald-400" : accuracy >= 70 ? "text-amber-400" : "text-rose-400";
  
  const quality = accuracy >= 85 ? "Excellent" : accuracy >= 70 ? "Good" : "Needs Improvement";

  const badgeClass = 
    accuracy >= 85 
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
      : accuracy >= 70 
        ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
        : "bg-rose-500/10 border-rose-500/20 text-rose-400";

  const paceStatus = 
    currentQpm >= targetQpm 
      ? "On Track" 
      : currentQpm >= targetQpm * 0.9 
        ? "Slightly Behind" 
        : "Needs Speed";
  
  const paceStatusColor = 
    currentQpm >= targetQpm 
      ? "text-emerald-400" 
      : currentQpm >= targetQpm * 0.9 
        ? "text-amber-400" 
        : "text-rose-400";

  const pacePercent = (currentQpm / targetQpm) * 100;

  const qualityBarClass = 
    accuracy >= 85 
      ? "from-emerald-500 to-cyan-400" 
      : accuracy >= 70 
        ? "from-amber-500 to-orange-400" 
        : "from-rose-500 to-red-500";

  return (
    <GlassCard className="p-8 space-y-10 animate-fade-in w-full">
      
      {/* Header & Session Status */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">PRACTICE SESSION</p>
        <h2 className="text-2xl font-bold">{topic}</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>{SUBJECT_LABELS[subject]}</span>
            <span>•</span>
            <span>{attemptsCount} Questions</span>
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">LIVE SESSION</span>
          </div>
        </div>
      </div>

      {/* Hero Timer */}
      <GlassCard className="py-20 px-8 text-center border-primary/10 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/20 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">SESSION TIMER</span>
        <h1 
          className="
            mt-4
            text-8xl md:text-9xl xl:text-[8rem] 2xl:text-[9rem]
            leading-none
            font-black
            font-mono
            tracking-[-0.12em]
            tabular-nums
            text-white
            drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]
          "
        >
          {formattedTime}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Elapsed Time</p>
      </GlassCard>

      {/* KPI Cards - Consistent with Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPICard title="Questions" value={attemptsCount} label="Attempted" icon={FileText} />
        <DashboardKPICard title="Correct" value={correctCount} label="Solved" icon={CheckCircle2} />
        <DashboardKPICard title="Wrong" value={incorrectCount} label="Missed" icon={XCircle} />
        <DashboardKPICard 
          title="Accuracy" 
          value={`${accuracy}%`} 
          label="Success Rate" 
          icon={Target}
          valueClassName={accuracyColorClass}
        />
      </div>

      {/* Pace Monitor */}
      <GlassCard className="p-6 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">QUESTION PACE</div>
            <div className="font-mono text-4xl font-black tabular-nums mt-1">
              {currentQpm.toFixed(2)} <span className="text-xl">QPM</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">TARGET</div>
            <div className="font-mono text-2xl font-semibold text-muted-foreground mt-1">
              {targetQpm.toFixed(2)} QPM
            </div>
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full transition-all duration-500 ${
              pacePercent >= 100
                ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                : pacePercent >= 80
                  ? "bg-gradient-to-r from-amber-500 to-orange-400"
                  : "bg-gradient-to-r from-rose-500 to-red-500"
            }`}
            style={{ width: `${Math.min(pacePercent, 150)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{pacePercent.toFixed(0)}% of target pace</span>
          <span className={`font-semibold ${paceStatusColor}`}>{paceStatus}</span>
        </div>
      </GlassCard>

      {/* Session Quality */}
      <GlassCard className="p-6 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl transition-all duration-300 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">SESSION QUALITY</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {quality}
          </span>
        </div>
        
        <div className="text-2xl font-semibold tabular-nums text-foreground">
          {accuracy}% <span className="text-base text-muted-foreground">Accuracy</span>
        </div>
        
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${qualityBarClass} transition-all duration-500`} 
            style={{ width: `${accuracy}%` }} 
          />
        </div>
      </GlassCard>

      {/* Motivational Line */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Keep your accuracy above{" "}
          <span className="font-semibold text-primary">85%</span>{" "}
          for maximum exam readiness.
        </p>
      </div>

      {/* Actions */}
      <div className="pt-8 border-t border-white/[0.06] space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <button 
            type="button" 
            onClick={() => logQuestion("correct")} 
            className="h-14 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 hover:scale-[1.02] transition-all duration-200 text-white font-semibold rounded-2xl"
          >
            <CheckCircle2 className="w-5 h-5" />
            Correct
          </button>
          
          <button 
            type="button" 
            onClick={() => logQuestion("incorrect")} 
            className="h-14 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 hover:scale-[1.02] transition-all duration-200 text-white font-semibold rounded-2xl"
          >
            <XCircle className="w-5 h-5" />
            Incorrect
          </button>
          
          <button 
            type="button" 
            onClick={undoLastQuestion} 
            disabled={attemptsCount === 0} 
            className="h-14 flex items-center justify-center gap-2 border border-border text-foreground font-semibold rounded-2xl hover:bg-card/50 active:scale-95 hover:scale-[1.02] transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Undo
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onPauseAndReview} 
          className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-white flex items-center justify-center gap-2"
        >
          Complete & Review
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </GlassCard>
  );
}
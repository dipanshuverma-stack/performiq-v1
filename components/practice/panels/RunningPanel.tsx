"use client";

import React from "react";
import { Subject } from "@prisma/client";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { formatTime } from "@/lib/practice/formatters";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardKPICard } from "@/components/ui/kpi-card";
import { FileText, CheckCircle2, XCircle, Target, ArrowRight, RotateCcw, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

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
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
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
  isPaused,
  onPause,
  onResume,
  logQuestion,
  undoLastQuestion,
  onPauseAndReview,
}: RunningPanelProps) {
  
  const formattedTime = formatTime(elapsedMs);
  const accuracyColorClass = accuracy >= 85 ? "text-emerald-400" : accuracy >= 70 ? "text-amber-400" : "text-rose-400";
  const quality = accuracy >= 85 ? "Excellent" : accuracy >= 70 ? "Good" : "Needs Improvement";
  const badgeClass = accuracy >= 85 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : accuracy >= 70 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400";
  const paceStatus = currentQpm >= targetQpm ? "On Track" : currentQpm >= targetQpm * 0.9 ? "Slightly Behind" : "Needs Speed";
  const paceStatusColor = currentQpm >= targetQpm ? "text-emerald-400" : currentQpm >= targetQpm * 0.9 ? "text-amber-400" : "text-rose-400";
  const pacePercent = (currentQpm / targetQpm) * 100;
  const qualityBarClass = accuracy >= 85 ? "from-emerald-500 to-cyan-400" : accuracy >= 70 ? "from-amber-500 to-orange-400" : "from-rose-500 to-red-500";

  return (
    <GlassCard className="p-8 space-y-10 animate-fade-in w-full">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">PRACTICE SESSION</p>
        <h2 className="text-2xl font-bold">{topic}</h2>
      </div>

      <GlassCard className="py-20 px-8 text-center border-primary/10 bg-gradient-to-b from-primary/5 to-transparent">
        <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold mb-6 border", isPaused ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")}>
          <div className={cn("h-2 w-2 rounded-full", isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse")} />
          {isPaused ? "SESSION PAUSED" : "SESSION ACTIVE"}
        </div>
        <h1 className={cn("mt-4 text-7xl md:text-8xl xl:text-[7rem] leading-none font-black font-mono tabular-nums text-white transition-all", isPaused && "animate-pulse text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.35)]")}>
          {formattedTime}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Elapsed Time</p>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPICard title="Questions" value={attemptsCount} label="Attempted" icon={FileText} />
        <DashboardKPICard title="Correct" value={correctCount} label="Solved" icon={CheckCircle2} />
        <DashboardKPICard title="Wrong" value={incorrectCount} label="Missed" icon={XCircle} />
        <DashboardKPICard title="Accuracy" value={`${accuracy}%`} label="Success Rate" icon={Target} valueClassName={accuracyColorClass} />
      </div>

      <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">QUESTION PACE</div>
            <div className="font-mono text-4xl font-black tabular-nums">{currentQpm.toFixed(2)} <span className="text-xl">QPM</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">TARGET</div>
            <div className="font-mono text-2xl font-semibold text-muted-foreground">{targetQpm.toFixed(2)} QPM</div>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
          <div className={cn("h-full transition-all duration-500", pacePercent >= 100 ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : pacePercent >= 80 ? "bg-gradient-to-r from-amber-500 to-orange-400" : "bg-gradient-to-r from-rose-500 to-red-500")} style={{ width: `${Math.min(pacePercent, 150)}%` }} />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{pacePercent.toFixed(0)}% of target pace</span>
          <span className={cn("font-semibold", paceStatusColor)}>{paceStatus}</span>
        </div>
      </GlassCard>

      {/* SESSION QUALITY CARD RESTORED */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">SESSION QUALITY</span>
          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", badgeClass)}>
            {quality}
          </span>
        </div>
        <div className="text-2xl font-semibold tabular-nums text-foreground">{accuracy}% <span className="text-base text-muted-foreground">Accuracy</span></div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", qualityBarClass)} style={{ width: `${accuracy}%` }} />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Keep your accuracy above <span className="font-semibold text-primary">85%</span> for maximum exam readiness.</p>
        </div>
      </GlassCard>

      <div className="pt-8 border-t border-white/[0.06] space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <button type="button" onClick={() => logQuestion("correct")} className="h-14 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-semibold"><CheckCircle2 className="w-5 h-5" /> Correct</button>
          <button type="button" onClick={() => logQuestion("incorrect")} className="h-14 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 rounded-2xl font-semibold"><XCircle className="w-5 h-5" /> Incorrect</button>
          <button type="button" onClick={undoLastQuestion} disabled={attemptsCount === 0} className="h-14 flex items-center justify-center border border-border rounded-2xl hover:bg-card/50"><RotateCcw className="w-5 h-5" /></button>
          {isPaused ? (
            <button onClick={onResume} className="h-14 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-semibold"><Play className="w-5 h-5" /> Resume</button>
          ) : (
            <button onClick={onPause} className="h-14 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 rounded-2xl font-semibold"><Pause className="w-5 h-5" /> Pause</button>
          )}
        </div>
        <button type="button" onClick={onPauseAndReview} className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2">
          Complete & Review <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </GlassCard>
  );
}
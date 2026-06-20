"use client";

import React from "react";
import { Subject } from "@prisma/client";
import { formatTime } from "@/lib/practice/formatters";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardKPICard } from "@/components/ui/kpi-card";
import { Clock, Target, FileText, Zap, ArrowRight } from "lucide-react";

interface ReviewPanelProps {
  topic: string;
  subject: Subject;
  elapsedMs: number;
  attemptsCount: number;
  accuracy: number;
  currentQpm: number;
  sessionNotes: string;
  setSessionNotes: (notes: string) => void;
  onDiscard: () => void;
  onCommit: () => void | Promise<void>;
  isSaving: boolean;
}

export function ReviewPanel({
  topic,
  subject,
  elapsedMs,
  attemptsCount,
  accuracy,
  currentQpm,
  sessionNotes,
  setSessionNotes,
  onDiscard,
  onCommit,
  isSaving,
}: ReviewPanelProps) {
  const formattedTime = formatTime(elapsedMs);

  const handleSave = async () => {
    if (isSaving) return;
    await onCommit();
  };

  return (
    <div className="space-y-8">
      {/* Review Hero */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">SESSION REVIEW</p>
        <h2 className="text-4xl font-bold tracking-tight">Practice Complete</h2>
        <p className="text-muted-foreground max-w-2xl">
          Review your performance before committing this session to your analytics.
        </p>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPICard 
          title="Duration" 
          value={formattedTime} 
          label="Time Spent" 
          icon={Clock} 
        />
        <DashboardKPICard
          title="Accuracy"
          value={`${accuracy}%`}
          label="Correct Answers"
          icon={Target}
          valueClassName={accuracy >= 85 ? "text-emerald-400" : accuracy >= 70 ? "text-amber-400" : "text-rose-400"}
        />
        <DashboardKPICard 
          title="Questions" 
          value={attemptsCount} 
          label="Attempted" 
          icon={FileText} 
        />
        <DashboardKPICard 
          title="Pace" 
          value={currentQpm.toFixed(2)} 
          label="QPM" 
          icon={Zap} 
        />
      </div>

      {/* Reflection / Notes */}
      <GlassCard className="p-8 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Reflection</h3>
          <span className="text-xs text-muted-foreground">Optional but recommended</span>
        </div>
        <p className="text-sm text-muted-foreground">
          What mistakes did you notice? What will you improve next time?
        </p>
        
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="I struggled with time management on quadratic equations... Next time I'll focus on..."
          className="w-full h-40 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-sm resize-y focus:outline-none focus:border-primary/30"
        />
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onDiscard}
          className="flex-1 h-14 border border-white/[0.08] hover:bg-white/[0.05] rounded-2xl font-medium transition-all"
        >
          Discard Session
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Practice Session"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
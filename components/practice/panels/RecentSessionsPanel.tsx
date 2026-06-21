"use client";

import React, { memo } from "react";
import { Subject } from "@prisma/client";
import { cn } from "@/lib/utils";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { GlassCard } from "@/components/ui/glass-card";
import { Trash2 } from "lucide-react";
import { deletePracticeSession } from "@/app/actions/practice";

interface PracticeSessionData {
  id: string;
  subject: Subject;
  topic: string;
  durationSeconds: number | null;
  accuracy: number;
  createdAt: Date;
  attemptsCount: number;
}

interface RecentSessionsPanelProps {
  recentSessions: PracticeSessionData[];
}

export const RecentSessionsPanel = memo(function RecentSessionsPanel({
  recentSessions,
}: RecentSessionsPanelProps) {
  
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this practice session?");
    if (!confirmed) return;

    await deletePracticeSession(id);
    window.location.reload(); 
  };

  const totalSessions = recentSessions.length;
  const bestAccuracy = recentSessions.length > 0 
    ? Math.max(...recentSessions.map(s => s.accuracy)) 
    : null;

  return (
    <GlassCard
      className="p-5 md:p-8 rounded-3xl flex flex-col h-full min-h-[480px] relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Recent Executions
          </h2>
          <p className="text-sm leading-6 text-slate-400 mt-2">
            Historical context pulled directly from Server logs.
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {recentSessions.length === 0 ? (
            <div className="mt-8 flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.06] bg-white/[0.02] px-8 text-center">
              <div className="mb-6 h-16 w-16 rounded-2xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center">
                📊
              </div>
              <h3 className="text-lg font-semibold text-white">
                No Practice Sessions Yet
              </h3>
              <p className="mt-2 text-sm text-slate-400 max-w-xs">
                Complete your first session to unlock analytics, speed tracking, accuracy trends and topic insights.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 flex-1">
              {recentSessions.map((session) => {
                const duration = session.durationSeconds ?? 0;
                return (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-white/[0.06] bg-black/25 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 hover:border-white/[0.10] hover:bg-white/[0.03] group"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{session.topic}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {SUBJECT_LABELS[session.subject] ?? session.subject}
                        </p>
                        <p className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded">
                          {session.attemptsCount} Questions
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-white/[0.05] pt-3 sm:pt-0">
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition text-red-500 hover:text-red-600 flex"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="text-right">
                        <p className="font-mono font-black text-foreground text-sm">
                          {Math.floor(duration / 60)}m {duration % 60}s
                        </p>
                        <p className={cn("text-[10px] font-black font-mono", session.accuracy >= 80 ? "text-emerald-500" : "text-amber-500")}>
                          {session.accuracy}% ACC
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 space-y-4 pt-6 border-t border-white/[0.06]">
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Latest Session</span>
            <span className="text-white font-semibold">{totalSessions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Best Accuracy</span>
            <span className="text-white font-semibold">
              {bestAccuracy !== null ? `${bestAccuracy}%` : "—"}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
});
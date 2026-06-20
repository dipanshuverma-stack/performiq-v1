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
    window.location.reload(); // TODO: Replace with optimistic update later
  };

  // Stats calculations
  const totalSessions = recentSessions.length;
  const bestAccuracy = recentSessions.length > 0 
    ? Math.max(...recentSessions.map(s => s.accuracy)) 
    : null;

  return (
    <GlassCard
      className="
        p-8
        h-full
        min-h-[540px]
        flex
        flex-col
        relative
        overflow-hidden
      "
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          top-0
          right-0
          h-64
          w-64
          rounded-full
          bg-indigo-500/5
          blur-3xl
        "
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Recent Executions
          </h2>
          <p className="text-sm leading-6 text-slate-400 mt-2">
            Historical context pulled directly from Server logs.
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {recentSessions.length === 0 ? (
            <div
              className="
                mt-8
                flex-1
                flex
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-white/[0.06]
                bg-white/[0.02]
                px-8
                text-center
              "
            >
              <div
                className="
                  mb-6
                  h-16
                  w-16
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  flex
                  items-center
                  justify-center
                "
              >
                📊
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Practice History
              </h3>

              <p className="mt-2 text-sm text-slate-400 max-w-xs">
                Complete your first practice session to unlock history, analytics and performance trends.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 flex-1">
              {recentSessions.map((session) => {
                const duration = session.durationSeconds ?? 0;
                return (
                  <div
                    key={session.id}
                    className="
                      rounded-2xl
                      border border-white/[0.06]
                      bg-black/25
                      backdrop-blur-md
                      p-4
                      flex
                      justify-between
                      items-center
                      text-xs
                      transition-all
                      duration-300
                      hover:border-white/[0.10]
                      hover:bg-white/[0.03]
                      hover:-translate-y-0.5
                      group
                    "
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{session.topic}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {SUBJECT_LABELS[session.subject] ?? session.subject}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1 shrink-0 pl-3">
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600 ml-auto flex"
                      >
                        <Trash2 size={14} />
                      </button>

                      <p className="font-mono font-black text-foreground">
                        {Math.floor(duration / 60)}m {duration % 60}s
                      </p>

                      <p
                        className={cn(
                          "text-[10px] font-black font-mono",
                          session.accuracy >= 80
                            ? "text-emerald-500"
                            : "text-amber-500"
                        )}
                      >
                        {session.accuracy}% ACC
                      </p>
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
            <span className="text-slate-500 text-sm">Sessions</span>
            <span className="text-white font-semibold">{totalSessions}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Best Accuracy</span>
            <span className="text-white font-semibold">
              {bestAccuracy !== null ? `${bestAccuracy}%` : "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Best Pace</span>
            <span className="text-white font-semibold">—</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
});
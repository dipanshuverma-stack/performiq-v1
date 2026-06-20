import React from "react";
import { Subject } from "@prisma/client";

interface AnalyticsData {
  totalMistakes: number;
  resolved: number;
  pending: number;
  resolutionRate: string;
  topWeakSubject: Subject | string | null;
  subjectBreakdown?: Record<string, number>;
  currentStreak?: number;
  longestStreak?: number;
}

interface SummaryProps {
  analytics: AnalyticsData;
  pendingReviewCount: number;
}

export function MistakeSummary({ analytics, pendingReviewCount }: SummaryProps) {
  const numericRate = parseFloat(analytics.resolutionRate) || 0;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      
      {/* 1. Pending Review */}
      <div className="group rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pending Review
            </p>
            <h2 className="mt-3 truncate text-4xl font-black text-red-400">
              {pendingReviewCount}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Awaiting revision
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
            📝
          </div>
        </div>
      </div>

      {/* 2. Current Streak */}
      <div className="group rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Current Streak
            </p>
            <h2 className="mt-3 truncate text-4xl font-black text-orange-400">
              {analytics.currentStreak ?? 0} <span className="text-2xl text-orange-400/50">Days</span>
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Keep going
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
            🔥
          </div>
        </div>
      </div>

      {/* 3. Longest Streak */}
      <div className="group rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Longest Streak
            </p>
            <h2 className="mt-3 truncate text-4xl font-black text-yellow-400">
              {analytics.longestStreak ?? 0} <span className="text-2xl text-yellow-400/50">Days</span>
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Personal best
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
            🏆
          </div>
        </div>
      </div>

      {/* 4. Fix Rate */}
      <div className="group rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Fix Rate
            </p>
            <h2 className="mt-3 truncate text-4xl font-black text-emerald-400">
              {analytics.resolutionRate}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {numericRate >= 80 ? "Excellent recovery" : numericRate >= 50 ? "Steady progress" : "Needs improvement"}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
            ✅
          </div>
        </div>
      </div>

      {/* 5. Weakest Area */}
      <div className="group rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Weakest Area
            </p>
            <h2 className="mt-3 truncate text-2xl sm:text-3xl font-black text-pink-400">
              {analytics.topWeakSubject 
                ? String(analytics.topWeakSubject).replace(/_/g, " ") 
                : "None"}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Needs attention
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] text-xl">
            ⚠️
          </div>
        </div>
      </div>

    </div>
  );
}
"use client";

import {
  Trophy,
  TrendingDown,
  Target,
  Brain,
} from "lucide-react";

interface MockIntelligenceProps {
  intelligence: {
    performanceLevel: string;
    strongestSubject: {
      subject: string;
      accuracy: number;
    } | null;
    weakestSubject: {
      subject: string;
      accuracy: number;
    } | null;
    focusNext: string | null;
    confidenceScore: number;
    targetAccuracy: number;
  };
}

export default function MockIntelligence({
  intelligence,
}: MockIntelligenceProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          PERFORMANCE INTELLIGENCE
        </p>
        <h2 className="mt-2 text-3xl font-black">Mock Insights</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Left - Large Performance Level Card */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#0E121B] p-8 flex flex-col">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              PERFORMANCE LEVEL
            </p>
            <h2 className="mt-4 text-3xl font-bold text-emerald-400">
              {intelligence.performanceLevel}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Current overall mock readiness based on recent performance.
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Exam Readiness Target</span>
              <span className="font-semibold text-cyan-400">
                {intelligence.targetAccuracy}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                style={{ width: `${intelligence.targetAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right - 2x2 Bento Grid */}
        <div className="grid grid-cols-2 gap-5">

          {/* Strongest Subject */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E121B] p-6 transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03]">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Strongest</p>
                <h3 className="mt-3 text-xl font-bold text-cyan-400">
                  {intelligence.strongestSubject?.subject ?? "-"}
                </h3>
                {intelligence.strongestSubject && (
                  <p className="text-xs text-cyan-400/70">
                    {intelligence.strongestSubject.accuracy.toFixed(1)}% accuracy
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Weakest Subject */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E121B] p-6 transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03]">
                <TrendingDown className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Weakest</p>
                <h3 className="mt-3 text-xl font-bold text-rose-400">
                  {intelligence.weakestSubject?.subject ?? "-"}
                </h3>
                {intelligence.weakestSubject && (
                  <p className="text-xs text-rose-400/70">
                    {intelligence.weakestSubject.accuracy.toFixed(1)}% accuracy
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Focus Next */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E121B] p-6 transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03]">
                <Brain className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Focus Next</p>
                <h3 className="mt-3 text-xl font-bold text-yellow-400">
                  {intelligence.focusNext ?? "-"}
                </h3>
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E121B] p-6 transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03]">
                <Trophy className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Confidence</p>
                <h3 className="mt-3 text-3xl font-bold text-indigo-400">
                  {intelligence.confidenceScore}
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
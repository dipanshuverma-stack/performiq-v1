"use client";

import { Subject } from "@prisma/client";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { GlassCard } from "@/components/ui/glass-card";

interface PracticeHeroProps {
  subject: Subject;
  topic: string;
  difficulty: string;
}

export function PracticeHero({
  subject,
  topic,
  difficulty,
}: PracticeHeroProps) {
  return (
    <GlassCard glow className="p-5 md:p-6">
      <div className="space-y-6">
        <div className="space-y-3">
          {/* Premium Pill Badge */}
          <span className="inline-flex rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-300">
            Practice Workspace
          </span>

          {/* Responsive Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Focused Practice Session
          </h1>

          {/* Responsive Description */}
          <p className="max-w-3xl text-sm md:text-base leading-6 md:leading-7 text-slate-400">
            Improve speed, accuracy and consistency through deliberate topic
            practice. Every question strengthens your preparation journey.
          </p>
        </div>

        {/* Responsive Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-500">
              Subject
            </p>
            <h3 className="mt-3 text-lg md:text-2xl font-semibold text-white">
              {SUBJECT_LABELS[subject] ?? subject}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-500">
              Current Topic
            </p>
            <h3 className="mt-3 text-lg md:text-2xl font-semibold text-white truncate">
              {topic}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-500">
              Difficulty
            </p>
            <h3 className="mt-3 text-lg md:text-2xl font-semibold text-white">
              {difficulty}
            </h3>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
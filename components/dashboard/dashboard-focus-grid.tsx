import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";
import { ArrowRight } from "lucide-react";

interface PriorityTopic {
  topic: string;
  mastery: number;
  focusScore: number;
}

interface DashboardFocusGridProps {
  priorities: PriorityTopic[];
}

// Pure helper function
function getPriorityBadge(score: number) {
  if (score > 70) {
    return {
      label: "High Priority",
      styles: "text-rose-400 border-rose-500/20 bg-rose-500/10",
    };
  }
  if (score >= 40) {
    return {
      label: "Medium Priority",
      styles: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    };
  }
  return {
    label: "Low Priority",
    styles: "text-slate-400 border-slate-500/20 bg-slate-500/10",
  };
}

export const DashboardFocusGrid = React.memo(function DashboardFocusGrid({
  priorities,
}: DashboardFocusGridProps) {
  if (priorities.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeader title="Today's Focus" />
        <GlassCard className="p-8 text-center text-slate-400">
          No priority topics yet. Keep practicing!
        </GlassCard>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeader title="Today's Focus" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {priorities.map((topic) => {
          const badge = getPriorityBadge(topic.focusScore);

          return (
            <GlassCard
              key={topic.topic}
              className="p-5 flex flex-col h-full hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
            >
              <div className="flex-1">
                <div className="mb-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${badge.styles}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-100 tracking-tight line-clamp-2 min-h-[40px]">
                  {topic.topic}
                </h3>

                <div className="mt-4 space-y-4">
                  {/* Mastery Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Mastery</span>
                      <span className="text-emerald-400 font-medium">
                        {topic.mastery}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(Math.max(topic.mastery, 0), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Focus Score Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Focus Score</span>
                      <span className="text-indigo-400 font-semibold">
                        {topic.focusScore}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.min(Math.max(topic.focusScore, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-2">
                <ActionButton
                  size="md"
                  className="w-full flex items-center justify-center gap-1.5 group"
                >
                  Start Studying
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </ActionButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
});
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";

interface PriorityTopic {
  topic: string;
  mastery: number;
  focusScore: number;
}

interface DashboardFocusGridProps {
  priorities: PriorityTopic[];
}

export function DashboardFocusGrid({ priorities }: DashboardFocusGridProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Today's Focus" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {priorities.map((topic) => (
          <GlassCard
            key={topic.topic}
            className="p-5 flex flex-col h-full hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
          >
            {/* Top Area: Content Container */}
            <div className="flex-1">
              {/* 
                TODO: Dynamic Priority Badge Injection for Phase 3:
                - focusScore > 70  → "High Priority" (text-rose-400 border-rose-500/20 bg-rose-500/5)
                - focusScore 40-70 → "Medium Priority" (text-amber-400 border-amber-500/20 bg-amber-500/5)
                - focusScore < 40  → "Low Priority" (text-slate-400 border-slate-500/20 bg-slate-500/5)
              */}
              
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight line-clamp-2 min-h-[40px]">
                {topic.topic}
              </h3>

              <div className="mt-4 space-y-4">
                {/* Mastery Track */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Mastery</span>
                    <span className="text-emerald-400 font-medium">{topic.mastery}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                </div>

                {/* Focus Score Track */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Focus Score</span>
                    <span className="text-indigo-400 font-semibold">{topic.focusScore}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${topic.focusScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Area: Pushed down cleanly */}
            <div className="mt-6 pt-2">
              {/* TODO: Add <ArrowRight className="h-3.5 w-3.5" /> icon during next component sweep */}
              <ActionButton size="md" className="w-full">
                Start Studying
              </ActionButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
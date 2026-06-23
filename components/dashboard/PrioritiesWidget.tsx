// components/dashboard/PrioritiesWidget.tsx
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";

interface PriorityItem {
  topic: string;
  focusScore?: number;
  mastery?: number;
}

export async function PrioritiesWidget({ userId }: { userId: string }) {
  const priorities = await getTopicPriorities(userId);
  const topPriorities = priorities.slice(0, 3);

  return (
    <section className="space-y-3">
      <SectionHeader title="Today's Priorities" />

      <GlassCard className="p-6">
        {topPriorities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400">No priority topics yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Complete more sessions to generate smart recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topPriorities.map((priority: PriorityItem, index: number) => (
              <div
                key={priority.topic || index}
                className="group flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-100 group-hover:text-white truncate transition-colors">
                    {priority.topic}
                  </p>
                  {priority.mastery !== undefined && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mastery: {Math.round(priority.mastery)}%
                    </p>
                  )}
                </div>

                {priority.focusScore !== undefined && (
                  <div className="text-right shrink-0 pl-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">
                      Focus
                    </span>
                    <p className="text-xl font-black text-indigo-400 tabular-nums">
                      {Math.round(priority.focusScore)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
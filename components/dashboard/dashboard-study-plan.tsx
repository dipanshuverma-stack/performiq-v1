import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";

interface PlanItem {
  subject: string;
  topic: string;
  duration: string;
}

interface DashboardStudyPlanProps {
  planItems: PlanItem[];
}

export function DashboardStudyPlan({ planItems }: DashboardStudyPlanProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Today's Study Plan" />

      <div className="space-y-3">
        {planItems.map((item, index) => (
          /* Enforced kinetic design symmetry with global card micro-lifts and indigo shadows */
          <GlassCard
            key={`${item.subject}-${index}`}
            className="p-4 hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Column: Contextual Syllabus Identifiers */}
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold select-none">
                  {item.subject}
                </p>
                <h4 className="text-sm font-medium text-slate-100 truncate">
                  {item.topic}
                </h4>
              </div>

              {/* Right Column: Execution Metrics & Triggers */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs text-slate-400 px-3 py-1 rounded-lg border border-white/[0.06] bg-white/[0.03] select-none">
                  {item.duration}
                </span>

                {/* TODO: Integrate Lucide Play/Arrow icon in subsequent interactive passes */}
                <ActionButton size="sm">
                  Start
                </ActionButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
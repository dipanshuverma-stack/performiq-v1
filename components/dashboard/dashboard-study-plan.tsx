import { Subject } from "@prisma/client"; // ✅ Fix: Imported the direct Subject enum
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";
import { Play } from "lucide-react";

// ✅ UX Enhancement: Dictionary to map backend enums cleanly to presentation display labels
import { SUBJECT_LABELS } from "@/config/syllabus";


interface PlanItem {
  subject: Subject;
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
            className="group p-4 hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Column: Contextual Syllabus Identifiers */}
              <div className="space-y-0.5 min-w-0">
                {/* ✅ UX Enhancement: Added display label transformation */}
                <p className="text-[11px] uppercase tracking-wider text-indigo-400/80 group-hover:text-indigo-400 font-semibold select-none transition-colors">
                  {SUBJECT_LABELS[item.subject] || item.subject}
                </p>
                <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate transition-colors">
                  {item.topic}
                </h4>
              </div>

              {/* Right Column: Execution Metrics & Triggers */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs text-slate-400 group-hover:text-slate-300 px-3 py-1 rounded-lg border border-white/[0.06] bg-white/[0.03] select-none transition-colors">
                  {item.duration}
                </span>

                {/* 🎯 Integrated Play icon with internal hover scaling */}
                <ActionButton size="sm" className="flex items-center gap-1.5 px-4 group/btn">
                  <Play className="h-3 w-3 fill-current transition-transform duration-200 group-hover/btn:scale-110" />
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
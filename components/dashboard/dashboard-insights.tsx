import React from "react";
import { CheckCircle2, AlertTriangle, PlayCircle, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface InsightsProps {
  strongestTopic: string;
  weakestTopic: string;
  nextFocus: string;
  revisionsCount: number;
  insightTitle: string;
  insightMessage: string;
}

// Static metrics definition
const insightMetrics = [
  { label: "Strongest Topic", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Weakest Topic", icon: AlertTriangle, color: "text-amber-500" },
  { label: "Next Focus", icon: PlayCircle, color: "text-indigo-400" },
  { label: "Revision Due", icon: Calendar, color: "text-slate-400" },
];

export const DashboardInsights = React.memo(function DashboardInsights({
  strongestTopic,
  weakestTopic,
  nextFocus,
  revisionsCount,
  insightTitle,
  insightMessage,
}: InsightsProps) {
  const metricsWithValues = insightMetrics.map((metric, index) => ({
    ...metric,
    value:
      index === 0 ? (strongestTopic || "—") :
      index === 1 ? (weakestTopic || "—") :
      index === 2 ? (nextFocus || "Continue Practice") :
      `${revisionsCount} Topics`,
  }));

  return (
    <section className="space-y-4">
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
        Performance Insights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricsWithValues.map((metric) => {
          const Icon = metric.icon;

          return (
            <GlassCard
              key={metric.label}
              className="p-4 flex items-center gap-4 group hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-200"
            >
              <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] ${metric.color}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {metric.label}
                </p>
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {metric.value}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-5 border border-indigo-500/20 bg-indigo-500/5">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            🧠 {insightTitle}
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            {insightMessage}
          </p>
        </div>
      </GlassCard>
    </section>
  );
});
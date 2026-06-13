import { CheckCircle2, AlertTriangle, PlayCircle, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface InsightsProps {
  strongestTopic: string;
  weakestTopic: string;
  nextFocus: string;
  revisionsCount: number;
}

export function DashboardInsights({ strongestTopic, weakestTopic, nextFocus, revisionsCount }: InsightsProps) {
  const insightMetrics = [
    { label: "Strongest Topic", value: strongestTopic, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Weakest Topic", value: weakestTopic, icon: AlertTriangle, color: "text-amber-500" },
    { label: "Next Focus", value: nextFocus, icon: PlayCircle, color: "text-indigo-400" },
    { label: "Revision Due", value: `${revisionsCount} Topics`, icon: Calendar, color: "text-slate-400" },
  ];

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
        Performance Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <GlassCard 
              key={metric.label} 
              className="p-4 flex items-center gap-4 group hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
            >
              {/* Premium Icon Container with scale-up on hover */}
              <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] ${metric.color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">
                  {metric.label}
                </p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate group-hover:text-white transition-colors">
                  {metric.value}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
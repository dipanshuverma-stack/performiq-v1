import { CheckCircle2, AlertTriangle, PlayCircle, Calendar } from "lucide-react";

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
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
        Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] ${metric.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-medium text-slate-500">{metric.label}</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
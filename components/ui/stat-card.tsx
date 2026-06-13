import { GlassCard } from "./glass-card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  /** 
   * TODO: Upgrade to a dynamic trend object in Phase 3 
   * e.g., { type: "percentage" | "status" | "text", value: "↑ 4.3%" | "On Track" | "Best This Month" }
   */
  label?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  label, 
  icon: Icon, 
  iconColor = "text-slate-400" 
}: StatCardProps) {
  return (
    /* Integrated premium indigo bloom drop shadow on hover state */
    <GlassCard className="p-5 flex flex-col justify-between hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-400 truncate">{title}</span>
        <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {label && (
          <span className="text-[11px] font-medium text-slate-500 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full select-none">
            {label}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
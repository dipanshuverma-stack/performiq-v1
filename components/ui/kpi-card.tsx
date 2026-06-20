import { GlassCard } from "@/components/ui/glass-card";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  label: string;
  icon: LucideIcon;
  valueClassName?: string;   // ← Added
}

export function DashboardKPICard({ 
  title, 
  value, 
  label, 
  icon: Icon,
  valueClassName 
}: KPICardProps) {
  return (
    <GlassCard className="p-5 flex flex-col justify-between hover:border-white/[0.12] hover:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <span className={`text-2xl font-bold tracking-tight ${valueClassName ?? "text-white"}`}>
          {value}
        </span>
        <span className="text-[11px] font-medium text-slate-500 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
          {label}
        </span>
      </div>
    </GlassCard>
  );
}
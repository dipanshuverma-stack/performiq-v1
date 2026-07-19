import { GlassCard } from "./glass-card";
import type { LucideIcon } from "lucide-react";

// Step 15.1 — Upgrade the Interface
interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon: LucideIcon;
  iconColor?: string;

  status?: string;
  statusColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  label, 
  icon: Icon, 
  iconColor = "text-slate-400",
  status,
  statusColor
}: StatCardProps) {
  return (
    /* Step 15.5 — Better Hover + Smoother transitions */
    <GlassCard className="p-5 flex flex-col justify-between hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-400 truncate">{title}</span>
        <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      {/* Step 15.2 — Restructured Content Container & Dominated Value */}
      <div className="mt-5">
        <h3 className="text-4xl font-black tracking-tight text-white">{value}</h3>
        
        {/* Step 15.3 — Label Placed Structurally Below Value */}
        {label && (
          <p className="mt-2 text-sm text-muted-foreground">
            {label}
          </p>
        )}

        {/* Step 15.4 — Contextual Status Indicator Dot */}
        {status && (
          <div className="mt-5 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {status}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
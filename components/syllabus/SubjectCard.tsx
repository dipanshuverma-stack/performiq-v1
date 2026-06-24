import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  title: string;
  completed: number;
  total: number;
  isParentExpanded?: boolean;
}

export function SubjectCard({ title, completed, total, isParentExpanded }: SubjectCardProps) {
  const progress = Math.round(Math.min(Math.max((completed / total) * 100, 0), 100));

  return (
    <GlassCard 
      glow
      className={cn(
        "group px-5 sm:px-8 py-6 sm:py-7 transition-all duration-300 cursor-pointer",
        "border border-white/[0.08]",
        "hover:-translate-y-1 hover:bg-[#111827] hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/30",
        isParentExpanded && "border-indigo-500/20 shadow-lg shadow-indigo-500/5"
      )}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-white leading-tight">
              {title}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-400 px-3 py-1 text-[11px] transition-all duration-300 group-hover:bg-white/[0.05] group-hover:border-white/[0.10]">
                {total} Topics
              </span>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-400 px-3 py-1 text-[11px] transition-all duration-300 group-hover:bg-white/[0.05] group-hover:border-white/[0.10]">
                Core Subject
              </span>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex-shrink-0 text-right">
            <span className="text-4xl sm:text-5xl font-black tracking-tighter text-white tabular-nums">
              {progress}
            </span>
            <span className="text-xl sm:text-2xl font-light text-slate-400">%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.04]">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-white tabular-nums">{completed}</span>
            <span className="text-slate-600">/</span>
            <span className="tabular-nums">{total}</span>
            <span className="text-[10px] uppercase tracking-widest ml-1 text-slate-500">COMPLETED</span>
          </div>

          <div className="text-xs text-emerald-400 font-medium">
            {progress === 100 ? "✅ MASTERED" : `${100 - progress}% LEFT`}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
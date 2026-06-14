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
        "group px-8 py-7 transition-all duration-300 cursor-pointer",
        "border border-white/[0.08]",
        "hover:-translate-y-1 hover:bg-[#111827] hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/30",
        isParentExpanded && "border-indigo-500/20 shadow-lg shadow-indigo-500/5"
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl lg:text-[30px] font-bold tracking-tight text-white">{title}</h3>
            <div className="flex gap-2 flex-wrap">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-400 px-3 py-1 text-[11px] transition-all duration-300 group-hover:bg-white/[0.05] group-hover:border-white/[0.10]">
                {total} Topics
              </span>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-400 px-3 py-1 text-[11px] transition-all duration-300 group-hover:bg-white/[0.05] group-hover:border-white/[0.10]">
                Core Subject
              </span>
            </div>
          </div>
          <span className="text-3xl font-black tracking-tight tabular-nums text-white pt-1">
            {progress}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.04]">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <p className="text-sm text-slate-400 flex items-center gap-2">
          <span className="font-semibold text-white tabular-nums">{completed}</span>
          <span className="text-slate-600">/</span>
          <span className="tabular-nums">{total}</span>
          <span className="text-slate-500 uppercase tracking-wide text-[10px] ml-1">Topics Completed</span>
        </p>
      </div>
    </GlassCard>
  );
}
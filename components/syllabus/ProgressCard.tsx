interface ProgressCardProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgressCard({ completed, total, percentage }: ProgressCardProps) {
  const displayPercentage = Math.round(Math.min(Math.max(percentage, 0), 100));

  return (
    <div className="border-y border-white/[0.06] py-8 sm:py-10 space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Overall Progress
          </h2>
          <p className="text-slate-400 max-w-md text-[15px] leading-relaxed">
            Track your mastery across all banking exam topics.
          </p>
        </div>

        {/* Big Percentage */}
        <div className="flex-shrink-0 text-right">
          <span className="text-6xl sm:text-7xl font-black tracking-tighter text-white tabular-nums">
            {displayPercentage}
          </span>
          <span className="text-3xl sm:text-4xl font-light text-slate-400 align-super">%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-white tabular-nums text-lg">{completed}</span>
          <span className="text-slate-600">/</span>
          <span className="tabular-nums">{total}</span>
          <span className="text-[11px] uppercase tracking-widest ml-1 text-slate-500">TOPICS COMPLETED</span>
        </div>

        <div className="text-emerald-400 text-sm font-medium">
          {displayPercentage === 100 ? "🎉 FULLY MASTERED" : `${100 - displayPercentage}% REMAINING`}
        </div>
      </div>
    </div>
  );
}
interface ProgressCardProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgressCard({ completed, total, percentage }: ProgressCardProps) {
  const displayPercentage = Math.round(Math.min(Math.max(percentage, 0), 100));

  return (
    <div className="border-y border-white/[0.06] py-10 space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Overall Progress
          </h2>
          <p className="text-slate-400 max-w-md">
            Track your mastery across all banking exam topics.
          </p>
        </div>
        <h2 className="text-5xl font-black tracking-tight tabular-nums text-white">
          {displayPercentage}%
        </h2>
      </div>

      <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.04]">
        <div
          className="h-full bg-indigo-500 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      <p className="text-sm text-slate-400 flex items-center gap-2">
        <span className="font-semibold text-white tabular-nums">{completed}</span>
        <span className="text-slate-600">/</span>
        <span className="tabular-nums">{total}</span>
        <span className="text-slate-500 uppercase tracking-wide text-[11px]">Topics Completed</span>
      </p>
    </div>
  );
}
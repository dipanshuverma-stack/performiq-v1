interface FocusCardProps {
  topic: string;
  mastery: number;
  focusScore: number;
}

export function DashboardFocusCard({ topic, mastery, focusScore }: FocusCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs">{topic}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Knowledge:</span>
          <span className="text-xs font-medium text-slate-300">{mastery}%</span>
        </div>
      </div>
      
      <div className="text-right shrink-0">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Focus Score</p>
        <p className="text-lg font-extrabold text-indigo-400">{focusScore}</p>
      </div>
    </div>
  );
}
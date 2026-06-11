interface AnalyticsData {
  totalMistakes: number;
  resolved: number;
  pending: number;
  resolutionRate: string; // Aligned with your backend service type
  topWeakSubject: string | null;
  subjectBreakdown?: Record<string, number>;
  currentStreak?: number;  // Made optional until backend tracking is wired
  longestStreak?: number;  // Made optional until backend tracking is wired
}

interface SummaryProps {
  analytics: AnalyticsData;
  pendingReviewCount: number;
}

export function MistakeSummary({ analytics, pendingReviewCount }: SummaryProps) {
  // Safe numeric conversion since the backend passes this as a string percentage
  const numericRate = parseFloat(analytics.resolutionRate) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {/* Master Queue Card */}
      <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending Review</span>
        <p className="text-2xl font-black mt-1 text-amber-900">{pendingReviewCount} Items</p>
        <span className="text-[10px] text-amber-600 block mt-0.5">Awaiting calibration</span>
      </div>

      <div className="bg-white border border-white/[0.06] p-4 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Streak</span>
        <p className="text-2xl font-black mt-1 text-slate-200">🔥 {analytics.currentStreak ?? 0} Days</p>
      </div>

      <div className="bg-white border border-white/[0.06] p-4 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Longest Streak</span>
        <p className="text-2xl font-black mt-1 text-slate-200">🏆 {analytics.longestStreak ?? 0} Days</p>
      </div>

      {/* Animated Progress Card */}
      <div className="bg-white border border-white/[0.06] p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Fix Rate</span>
          <span className="text-xs font-black text-indigo-400">{analytics.resolutionRate}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${numericRate}%` }}
          />
        </div>
      </div>

      <div className="bg-white border border-white/[0.06] p-4 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Weakest Area</span>
        <p className="text-sm font-extrabold mt-2 text-rose-400 truncate bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded w-fit max-w-full">
          {analytics.topWeakSubject || "Stable"}
        </p>
      </div>
    </div>
  );
}
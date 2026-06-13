interface SummaryProps {
  metrics: {
    totalSessions: number;
    totalQuestions: number;
    averageAccuracy: number;
    averageQpm: number;
  };
}

export function HistorySummary({ metrics }: SummaryProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalSessions}</p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Questions</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalQuestions}</p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Accuracy</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.averageAccuracy.toFixed(1)}%</p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg QPM</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.averageQpm.toFixed(2)}</p>
      </div>
    </div>
  );
}
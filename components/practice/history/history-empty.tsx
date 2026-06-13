import Link from "next/link";
import { BarChart3, BookOpen, BrainCircuit, History, Zap } from "lucide-react";

export function HistoryEmpty() {
  const provisions = [
    { label: "Performance Analytics Engine", icon: BarChart3 },
    { label: "Adaptive Speed Tracking (QPM Metrics)", icon: Zap },
    { label: "Targeted Revision Mistake Book", icon: BookOpen },
    { label: "AI-Powered Focus Coach Insights", icon: BrainCircuit },
  ];

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-8 max-w-xl mx-auto text-center shadow-sm my-12">
      <div className="mx-auto w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner mb-4">
        <History className="h-6 w-6" />
      </div>

      {/* Gamified Engagement Streak Anchor Hook */}
      <div className="inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 text-xs text-amber-800 font-semibold mb-4 animate-pulse">
        <span>🔥 Current streak: 0 days</span>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-1">No Practice Sessions Yet</h2>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        Start practicing to build your streak and unlock analytics, speed tracking, and the Mistake Book.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left max-w-sm mx-auto space-y-3 mb-8">
        {provisions.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center text-sm text-gray-700 font-medium space-x-3">
              <Icon className="h-4 w-4 text-slate-500 shrink-0" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <Link 
        href="/practice"
        className="inline-flex items-center justify-center w-full max-w-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md text-sm"
      >
        Start First Practice Session
      </Link>
    </div>
  );
}
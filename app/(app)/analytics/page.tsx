import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getPracticeAnalytics, TARGET_PRELIMS_QPM } from "@/lib/analytics/practice-analytics";
import { getPracticeAccuracyTrend, getPracticeQpmTrend } from "@/lib/analytics/practice-trends";
import PracticeAccuracyChart from "@/components/charts/practice-accuracy-chart";
import PracticeQpmChart from "@/components/charts/practice-qpm-chart";

export default async function PracticeAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [accuracyTrend, qpmTrend, analytics] = await Promise.all([
    getPracticeAccuracyTrend(session.user.id),
    getPracticeQpmTrend(session.user.id),
    getPracticeAnalytics(session.user.id),
  ]);

  if (analytics.totalSessions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-7xl mb-6">📈</div>
          <h2 className="text-3xl font-bold mb-4">No Practice Data Yet</h2>
          <p className="text-slate-400 mb-8">Complete your first practice session to unlock detailed analytics and trends.</p>
          <a 
            href="/practice" 
            className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold text-white transition"
          >
            Start First Practice Session
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Practice Analytics</h1>
        <p className="text-slate-400 mt-2">Track your speed, accuracy & consistency</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">SESSIONS</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.totalSessions}</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">AVG ACCURACY</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.averageAccuracy}%</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">AVG QPM</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.averageQPM}</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">SPEED SCORE</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.speedScore}%</p>
          <div className="mt-4 h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${analytics.speedScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic Intelligence */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Topic Intelligence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400">BEST TOPIC</p>
            <p className="mt-2 text-xl font-bold">{analytics.bestTopic?.topic || "—"}</p>
            <p className="text-emerald-400 text-sm">
              {analytics.bestTopic?.accuracy}% Accuracy
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-red-400">WEAKEST TOPIC</p>
            <p className="mt-2 text-xl font-bold text-red-400">{analytics.weakestTopic?.topic || "—"}</p>
            <p className="text-red-400 text-sm">
              {analytics.weakestTopic?.accuracy}% Accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Exam Readiness */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Exam Readiness</h2>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-400">Current Speed</p>
            <p className="text-3xl font-bold text-white">{analytics.averageQPM} QPM</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Target</p>
            <p className="text-3xl font-bold text-emerald-400">{TARGET_PRELIMS_QPM} QPM</p>
          </div>
        </div>
        <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${analytics.speedScore}%` }} 
          />
        </div>
      </div>

      {/* Performance Trends */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Performance Trends</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <PracticeAccuracyChart data={accuracyTrend} />
          <PracticeQpmChart data={qpmTrend} />
        </div>
      </div>
    </div>
  );
}
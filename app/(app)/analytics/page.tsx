import { auth } from "@/auth";
import { getPracticeAnalytics, TARGET_PRELIMS_QPM } from "@/lib/analytics/practice-analytics";
import PracticeAccuracyChart from "@/components/charts/practice-accuracy-chart";
import PracticeQpmChart from "@/components/charts/practice-qpm-chart";
import { redirect } from "next/navigation";
import { getPracticeAccuracyTrend, getPracticeQpmTrend } from "@/lib/analytics/practice-trends";

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
      <div className="max-w-7xl mx-auto p-8">
        <div className="rounded-3xl border border-dashed border-white/[0.08] bg-[#0E121B] p-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold mb-3">No Practice Data Yet</h2>
          <p className="text-muted-foreground mb-8">Complete your first practice session to unlock performance insights.</p>
          <a href="/practice" className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all">Start Practice Session</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-black">Practice Health</h1>

      {/* 1. Practice Health Hero */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Practice Health</p>
        <div className="flex items-baseline gap-4 mt-2">
          <span className="text-6xl font-black">{analytics.averageAccuracy} / 100</span>
          <span className="text-emerald-400 font-semibold">↑ 6 this month</span>
        </div>
        <p className="text-lg text-muted-foreground mt-2">Good Progress</p>
      </div>

      {/* 2. Metric Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Sessions", value: analytics.totalSessions },
          { label: "Accuracy Rate", value: `${analytics.averageAccuracy}%` },
          { label: "Speed Performance", value: `${analytics.averageQPM} QPM` },
          { label: "Exam Readiness", value: "74 / 100" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Topic Intelligence */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-bold mb-6">TOPIC INTELLIGENCE</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">Best Performing</p>
            <p className="text-2xl font-bold">{analytics.bestTopic?.topic || "N/A"}</p>
            <p className="text-emerald-400">{analytics.bestTopic?.accuracy}% Accuracy</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">Weakest Area</p>
            <p className="text-2xl font-bold text-red-400">{analytics.weakestTopic?.topic || "N/A"}</p>
            <p className="text-red-400">{analytics.weakestTopic?.accuracy}% Accuracy</p>
          </div>
        </div>
      </div>

      {/* 4. Exam Readiness */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-bold mb-6">EXAM READINESS</h2>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-muted-foreground">Current: <span className="text-white font-bold">{analytics.averageQPM} QPM</span></p>
            <p className="text-muted-foreground">Target: <span className="text-white font-bold">{TARGET_PRELIMS_QPM} QPM</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Gap</p>
            <p className="text-xl font-bold">0.25 QPM</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analytics.speedScore}%` }} />
        </div>
      </div>

      {/* 5. Performance Trends */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-bold mb-8">PERFORMANCE TRENDS</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <PracticeAccuracyChart data={accuracyTrend} />
          <PracticeQpmChart data={qpmTrend} />
        </div>
      </div>

      {/* 6. Weak Areas */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-bold mb-6">WEAK AREAS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Data Interpretation", "Puzzle", "Probability", "Cloze Test", "Seating Arrangement"].map((topic, i) => (
            <div key={topic} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02]">
              <span className="text-xl font-bold text-muted-foreground/50">0{i + 1}</span>
              <p className="font-semibold">{topic}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
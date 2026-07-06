import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { cache } from "react";

import {
  getPracticeAnalytics,
  TARGET_PRELIMS_QPM,
} from "@/lib/analytics/practice-analytics";

import {
  getPracticeAccuracyTrend,
  getPracticeQpmTrend,
} from "@/lib/analytics/practice-trends";

import { getPracticeSubjectAnalytics } from "@/lib/analytics/practice-subject-analytics";
import { getPracticeDifficultyAnalytics } from "@/lib/analytics/practice-difficulty-analytics";

import DifficultyPerformanceTable from "@/components/analytics/difficulty-performance-table";
import PracticeAccuracyChart from "@/components/charts/practice-accuracy-chart";
import PracticeQpmChart from "@/components/charts/practice-qpm-chart";
import SubjectPerformanceTable from "@/components/analytics/SubjectPerformanceTable";

const cachedGetUser = cache(async (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
);

const cachedGetAnalytics = cache(async (userId: string) =>
  getPracticeAnalytics(userId)
);

const cachedGetAccuracyTrend = cache(async (userId: string) =>
  getPracticeAccuracyTrend(userId)
);

const cachedGetQpmTrend = cache(async (userId: string) =>
  getPracticeQpmTrend(userId)
);

const cachedGetSubjectAnalytics = cache(async (userId: string) =>
  getPracticeSubjectAnalytics(userId)
);

const cachedGetDifficultyAnalytics = cache(async (userId: string) =>
  getPracticeDifficultyAnalytics(userId)
);

export default async function PracticeAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  const userId = user.id;

  // Parallel + Cached fetching
  const [analytics, accuracyTrend, qpmTrend, subjectAnalytics, difficultyAnalytics] =
    await Promise.all([
      cachedGetAnalytics(userId),
      cachedGetAccuracyTrend(userId),
      cachedGetQpmTrend(userId),
      cachedGetSubjectAnalytics(userId),
      cachedGetDifficultyAnalytics(userId),
    ]);

  if (analytics.totalSessions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">📈</div>
          <h2 className="text-3xl font-bold mb-4">No Practice Data Yet</h2>
          <p className="text-slate-400 mb-8">
            Complete your first practice session to unlock detailed analytics, accuracy trends, and performance insights.
          </p>
          <a
            href="/practice"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors"
          >
            Start First Practice Session
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Practice Analytics</h1>
        <p className="text-slate-400 mt-2 text-[15px]">
          Measure your speed, accuracy, and consistency
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... KPI cards unchanged ... */}
        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Sessions</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.totalSessions}</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg Accuracy</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.averageAccuracy}%</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg QPM</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.averageQPM}</p>
        </div>

        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Speed Score</p>
          <p className="text-4xl font-bold mt-3 text-white">{analytics.speedScore}%</p>
          <div className="mt-4 h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${analytics.speedScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary + Intelligence */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
          <h2 className="font-semibold text-lg mb-5">Practice Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Questions</span>
              <strong>{analytics.totalQuestions}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Practice Hours</span>
              <strong>{analytics.totalPracticeHours}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target QPM</span>
              <strong className="text-emerald-400">{TARGET_PRELIMS_QPM}</strong>
            </div>
          </div>
        </div>

        {/* Topic Intelligence */}
        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
          <h2 className="font-semibold text-lg mb-5">Topic Intelligence</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">Best Topic</p>
              {analytics.bestTopic ? (
                <div className="mt-2">
                  <p className="font-semibold">{analytics.bestTopic.topic}</p>
                  <p className="text-xs text-slate-400">
                    {analytics.bestTopic.accuracy}% • {analytics.bestTopic.qpm} QPM
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 mt-2">—</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-red-400">Weakest Topic</p>
              {analytics.weakestTopic ? (
                <div className="mt-2">
                  <p className="font-semibold text-red-400">{analytics.weakestTopic.topic}</p>
                  <p className="text-xs text-slate-400">
                    {analytics.weakestTopic.accuracy}% • {analytics.weakestTopic.qpm} QPM
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 mt-2">—</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tables & Charts - Non-blocking with Suspense */}
      <Suspense fallback={<div className="h-96 bg-[#0E121B] rounded-3xl animate-pulse" />}>
        <SubjectPerformanceTable data={subjectAnalytics} />
      </Suspense>

      <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
        <h2 className="font-semibold text-xl mb-6">Performance Trends</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="h-[380px] bg-[#1A1F2E] rounded-2xl animate-pulse" />}>
            <PracticeAccuracyChart data={accuracyTrend} />
          </Suspense>
          <Suspense fallback={<div className="h-[380px] bg-[#1A1F2E] rounded-2xl animate-pulse" />}>
            <PracticeQpmChart data={qpmTrend} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="h-96 bg-[#0E121B] rounded-3xl animate-pulse" />}>
        <DifficultyPerformanceTable data={difficultyAnalytics} />
      </Suspense>
    </div>
  );
}
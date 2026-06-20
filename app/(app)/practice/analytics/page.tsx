import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  getPracticeAnalytics,
  TARGET_PRELIMS_QPM,
} from "@/lib/analytics/practice-analytics";

import {
  getPracticeAccuracyTrend,
  getPracticeQpmTrend,
} from "@/lib/analytics/practice-trends";

import { getPracticeSubjectAnalytics } from "@/lib/analytics/practice-subject-analytics";

// ✅ 1. Added Difficulty Analytics Imports
import { getPracticeDifficultyAnalytics } from "@/lib/analytics/practice-difficulty-analytics";
import DifficultyPerformanceTable from "@/components/analytics/difficulty-performance-table";

import PracticeAccuracyChart from "@/components/charts/practice-accuracy-chart";
import PracticeQpmChart from "@/components/charts/practice-qpm-chart";
import SubjectPerformanceTable from "@/components/analytics/SubjectPerformanceTable";

export default async function PracticeAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // ✅ 2. Updated Promise.all to fetch difficulty trends concurrently
  const [
    accuracyTrend,
    qpmTrend,
    analytics,
    subjectAnalytics,
    difficultyAnalytics,
  ] = await Promise.all([
    getPracticeAccuracyTrend(user.id),
    getPracticeQpmTrend(user.id),
    getPracticeAnalytics(user.id),
    getPracticeSubjectAnalytics(user.id),
    getPracticeDifficultyAnalytics(user.id),
  ]);

  if (analytics.totalSessions === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Practice Analytics</h1>

        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📈</div>

          <h2 className="text-2xl font-bold mb-3">No Practice Data Yet</h2>

          <p className="text-gray-600 mb-6">
            Complete your first practice session to unlock analytics, accuracy
            trends, speed tracking, and performance insights.
          </p>

          <a
            href="/practice"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Start Practice Session
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">Practice Analytics</h1>
        <p className="text-gray-500 mt-1">
          Measure your speed, accuracy and consistency across every practice
          session.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Sessions</p>
          <p className="text-4xl font-bold mt-2">{analytics.totalSessions}</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-4xl font-bold mt-2">
            {analytics.averageAccuracy}%
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Average QPM</p>
          <p className="text-4xl font-bold mt-2">{analytics.averageQPM}</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-sm text-gray-500">Speed Score</p>
          <p className="text-4xl font-bold mt-2">{analytics.speedScore}%</p>
          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{
                width: `${analytics.speedScore}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-5">Practice Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Questions</span>
              <strong>{analytics.totalQuestions}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Practice Hours</span>
              <strong>{analytics.totalPracticeHours}</strong>
            </div>
            <div className="flex justify-between">
              <span>Target QPM</span>
              <strong>{TARGET_PRELIMS_QPM}</strong>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-5">Topic Intelligence</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Best Topic
              </p>
              {analytics.bestTopic ? (
                <>
                  <h3 className="font-bold text-lg mt-1">
                    {analytics.bestTopic.topic}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Accuracy {analytics.bestTopic.accuracy}% • QPM{" "}
                    {analytics.bestTopic.qpm} • {analytics.bestTopic.sessions}{" "}
                    sessions
                  </p>
                </>
              ) : (
                "-"
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Weakest Topic
              </p>
              {analytics.weakestTopic ? (
                <>
                  <h3 className="font-bold text-lg mt-1 text-red-600">
                    {analytics.weakestTopic.topic}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Accuracy {analytics.weakestTopic.accuracy}% • QPM{" "}
                    {analytics.weakestTopic.qpm} • {analytics.weakestTopic.sessions}{" "}
                    sessions
                  </p>
                </>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <SubjectPerformanceTable data={subjectAnalytics} />

      {/* Benchmarks & Charts */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-semibold text-xl">Banking PO Speed Benchmark</h2>
          <p className="text-gray-500 mt-1">
            Target: 100 Questions in 60 Minutes ({TARGET_PRELIMS_QPM} QPM)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <PracticeAccuracyChart data={accuracyTrend} />
          <PracticeQpmChart data={qpmTrend} />
        </div>
      </div>

      {/* ✅ 3. Added Difficulty Performance Table at the bottom of the viewport stack */}
      <DifficultyPerformanceTable data={difficultyAnalytics} />
    </div>
  );
}
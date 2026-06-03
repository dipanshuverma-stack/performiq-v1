import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getPracticeAnalytics,
  TARGET_PRELIMS_QPM,
} from "@/lib/analytics/practice-analytics";
import PracticeAccuracyChart from "@/components/charts/practice-accuracy-chart";
import PracticeQpmChart from "@/components/charts/practice-qpm-chart";
import { redirect } from "next/navigation";

import {
  getPracticeAccuracyTrend,
  getPracticeQpmTrend,
} from "@/lib/analytics/practice-trends";

export default async function PracticeAnalyticsPage() {
  const session = await auth();

  // 🚀 OPTIMIZATION: Extract user ID directly from the session token
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Runs trend aggregations and analytical engines concurrently right away
  const [accuracyTrend, qpmTrend, analytics] = await Promise.all([
    getPracticeAccuracyTrend(session.user.id),
    getPracticeQpmTrend(session.user.id),
    getPracticeAnalytics(session.user.id),
  ]);

  if (analytics.totalSessions === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Practice Analytics</h1>
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold mb-3">No Practice Data Yet</h2>
          <p className="text-gray-600 mb-6">
            Complete your first practice session to unlock analytics,
            accuracy trends, speed tracking, and performance insights.
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
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Practice Analytics</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Sessions</p>
          <p className="text-3xl font-bold mt-2">{analytics.totalSessions}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Accuracy</p>
          <p className="text-3xl font-bold mt-2">{analytics.averageAccuracy}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Average QPM</p>
          <p className="text-3xl font-bold mt-2">{analytics.averageQPM}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Speed Score</p>
          <p className="text-3xl font-bold mt-2">{analytics.speedScore}%</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Practice Summary</h2>
          <div className="space-y-3">
            <p>Total Questions: <strong>{analytics.totalQuestions}</strong></p>
            <p>Total Practice Hours: <strong>{analytics.totalPracticeHours}</strong></p>
            <p>Target QPM: <strong>{TARGET_PRELIMS_QPM}</strong></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Topic Performance</h2>
          <div className="space-y-3">
            <p>Best Topic: <strong>{analytics.bestTopic ?? "-"}</strong></p>
            <p>Weakest Topic: <strong>{analytics.weakestTopic ?? "-"}</strong></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Banking PO Speed Benchmark</h2>
        <p>Target: <strong>100 Questions in 60 Minutes</strong></p>
        <p className="mt-2">Required QPM: <strong>{TARGET_PRELIMS_QPM}</strong></p>
        <p className="mt-2">Your Current QPM: <strong>{analytics.averageQPM}</strong></p>
        <p className="mt-2">Progress: <strong>{analytics.speedScore}%</strong></p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <PracticeAccuracyChart data={accuracyTrend} />
          <PracticeQpmChart data={qpmTrend} />
        </div>
      </div>
    </div>
  );
}
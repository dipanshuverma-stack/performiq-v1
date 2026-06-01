// app/analytics/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSubjectIntelligence } from "@/lib/analytics/subject-intelligence";
import { getMockTrends } from "@/lib/analytics/mock-trends";
import { getWeakTopics } from "@/lib/analytics/weak-topics";
import { getRevisionIntelligence } from "@/lib/analytics/revision-intelligence";
import { getWeeklyStudyTrend } from "@/lib/analytics/study-trend";
import { getReadinessScore } from "@/lib/analytics/readiness";

export default async function AnalyticsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  const [
    intelligence,
    trends,
    weakTopics,
    revisionData,
    weeklyTrend,
    readiness,
  ] = await Promise.all([
    getSubjectIntelligence(user.id),
    getMockTrends(user.id),
    getWeakTopics(user.id),
    getRevisionIntelligence(user.id),
    getWeeklyStudyTrend(user.id),
    getReadinessScore(user.id),
  ]);

  const totalWeeklyMinutes = weeklyTrend.reduce((acc, curr) => acc + curr.minutes, 0);
  const averageWeeklyMinutes = Math.round(totalWeeklyMinutes / (weeklyTrend.length || 1));

  const bestDayObj = weeklyTrend.reduce(
    (max, day) => (day.minutes > max.minutes ? day : max),
    { day: "-", minutes: 0 }
  );
  const bestStudyDay = bestDayObj.minutes > 0 ? bestDayObj.day : "-";

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Performance Intelligence</h1>

      {/* Exam Readiness Card */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Exam Readiness</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border rounded-lg p-4 bg-blue-50/50 border-blue-100">
            <p className="text-sm text-gray-500 font-medium">Readiness Score</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{readiness.readiness}%</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">Syllabus Completion</p>
            <p className="text-2xl font-bold mt-1">{readiness.completionScore}%</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">Mock performance</p>
            <p className="text-2xl font-bold mt-1">{readiness.mockScore}%</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">Revision Score</p>
            <p className="text-2xl font-bold mt-1">{readiness.revisionScore}%</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">Unresolved Mistakes</p>
            <p className={`text-2xl font-bold mt-1 ${readiness.unresolvedMistakes > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {readiness.unresolvedMistakes}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Strongest Subject</p>
          <h2 className="text-2xl font-bold text-green-700 mt-2">
            {intelligence.strongestSubject?.subject ?? "-"}
          </h2>
          <p className="mt-1 text-gray-600">
            Avg Score: {intelligence.strongestSubject?.averageScore ?? 0}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Weakest Subject</p>
          <h2 className="text-2xl font-bold text-red-700 mt-2">
            {intelligence.weakestSubject?.subject ?? "-"}
          </h2>
          <p className="mt-1 text-gray-600">
            Avg Score: {intelligence.weakestSubject?.averageScore ?? 0}
          </p>
        </div>
      </div>

      {/* Mock Trends */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Avg Accuracy</p>
          <p className="text-2xl font-bold">{trends.averageAccuracy.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Best Accuracy</p>
          <p className="text-2xl font-bold text-green-600">{trends.bestAccuracy.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Latest Accuracy</p>
          <p className="text-2xl font-bold">{trends.latestAccuracy.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Improvement</p>
          <p
            className={`text-2xl font-bold ${
              trends.improvement >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trends.improvement.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Weekly Study Trend */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Weekly Study Trend</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-7 gap-2 text-center">
            {weeklyTrend.map((item) => (
              <div key={item.day} className="border rounded-lg p-2 bg-gray-50">
                <p className="text-sm font-semibold text-gray-600">{item.day}</p>
                <p className="text-xl font-bold mt-1">{item.minutes}</p>
                <p className="text-xs text-gray-400">min</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Minutes</p>
              <p className="text-2xl font-bold mt-1">{totalWeeklyMinutes} min</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Average Minutes Per Day</p>
              <p className="text-2xl font-bold mt-1">{averageWeeklyMinutes} min</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Best Study Day</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{bestStudyDay}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Intelligence */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Subject Intelligence</h2>
        </div>

        {intelligence.subjects.length === 0 ? (
          <div className="p-6 text-gray-500">No subject data available yet.</div>
        ) : (
          <div className="divide-y">
            {intelligence.subjects.map((subject) => (
              <div key={subject.subject} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{subject.subject}</h3>
                  <p className="text-sm text-gray-500">Mocks Attempted: {subject.mocks}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Avg Score: {subject.averageScore}</p>
                  <p className="text-sm text-gray-500">Avg Accuracy: {subject.averageAccuracy}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revision Intelligence */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Revision Intelligence</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 p-6">
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-3xl font-bold">{revisionData.total}</p>
          </div>
          <div>
            <p className="text-gray-500">Due Today</p>
            <p className="text-3xl font-bold text-orange-600">{revisionData.dueToday}</p>
          </div>
          <div>
            <p className="text-gray-500">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{revisionData.overdue}</p>
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Weak Topics</h2>
        </div>
        {weakTopics.length === 0 ? (
          <div className="p-6 text-gray-500">No topic-level data available yet.</div>
        ) : (
          <div className="divide-y">
            {weakTopics.map((topic) => (
              <div key={topic.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{topic.topic}</h3>
                  <p className="text-sm text-gray-500">{topic.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">{topic.accuracy.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Accuracy</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
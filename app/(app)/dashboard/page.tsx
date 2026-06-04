// app/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dailyPlan } from "@/lib/daily-plan";
import { startStudySession } from "@/app/actions/study-session";
import { getReadinessScore } from "@/lib/analytics/readiness";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { calculateDailyTarget } from "@/lib/analytics/daily-target";
import { getSyllabusProgress } from "@/lib/analytics/syllabus-progress";
import { getPracticeAnalytics } from "@/lib/analytics/practice-analytics";
import { SmartLink as Link } from "@/components/smart-link";import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { getPerformanceScore } from "@/lib/analytics/performance-score";
import DashboardAccuracyChart from "@/components/charts/dashboard-accuracy-chart";
import DashboardQpmChart from "@/components/charts/dashboard-qpm-chart";
import { getPracticeAccuracyTrend, getPracticeQpmTrend } from "@/lib/analytics/practice-trends";
import { getExamForecast } from "@/lib/analytics/exam-forecast";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }, // Index-only lookup projection 
  });

  if (!user) {
    redirect("/login");
  }

  const userId = user.id;

  // Single global concurrent thread group for all analytical and tracking queries
  const [
    readiness,
    activeExam,
    practiceAnalytics,
    progress,
    accuracyTrend,
    qpmTrend,
    forecast,
    priorities,
    performance,
    studySessions,
    completedTopics,
    completedTasks,
    totalTasks,
    totalMocks,
    averageAccuracyResult,
    revisionDueToday,
    latestMock,
    revisionRemaining,
    unreadNotifications,
  ] = await Promise.all([
    getReadinessScore(userId),
    getActiveExam(userId),
    getPracticeAnalytics(userId),
    getSyllabusProgress(userId),
    getPracticeAccuracyTrend(userId),
    getPracticeQpmTrend(userId),
    getExamForecast(userId),
    getTopicPriorities(userId),
    getPerformanceScore(userId),
    prisma.studySession.aggregate({
      where: { userId },
      _sum: { duration: true },
      _count: { id: true },
    }),
    prisma.topicProgress.count({
      where: { userId, completed: true },
    }),
    prisma.task.count({
      where: { userId, completed: true },
    }),
    prisma.task.count({
      where: { userId },
    }),
    prisma.mockTest.count({
      where: { userId },
    }),
    prisma.mockTest.aggregate({
      where: { userId },
      _avg: { accuracy: true },
    }),
    prisma.revision.count({
      where: {
        userId,
        nextRevision: { lte: new Date() },
      },
    }),
    prisma.mockTest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.revision.count({
      where: { userId },
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
  ]);

  const topPriorities = priorities.slice(0, 3);

  const daysRemaining = activeExam?.targetDate
    ? Math.ceil((activeExam.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const averageAccuracy = averageAccuracyResult?._avg?.accuracy ?? 0;
  const totalTopics = progress.totalTopics;
  const progressPercentage = Number(progress.percentage);
  const topicRemaining = Math.max(0, totalTopics - completedTopics);

  const dailyTarget = calculateDailyTarget(
    daysRemaining ?? 0,
    topicRemaining,
    revisionRemaining
  );

  const totalMinutes = studySessions._sum.duration ?? 0;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalSessions = studySessions._count.id;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome {session.user.name ?? "Guest"} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {activeExam ? `Preparing for ${activeExam.name}` : "No active exam selected"}
          </p>
        </div>

        {/* Section: Active Exam Core Metrics */}
        <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
          <h2 className="text-2xl font-bold border-b pb-3 text-gray-800">
            {activeExam?.name ?? "No Active Exam"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Readiness</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{readiness?.readiness ?? 0}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Forecast</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{forecast.forecastScore}</p>
              <p className="text-xs text-gray-500 mt-1">{forecast.readinessLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{performance.score}</p>
              <p className="text-xs text-gray-500 mt-1">
                Accuracy {performance.accuracy}% · Speed {performance.speedScore}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Days Remaining</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{daysRemaining ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Exam Type</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeExam?.examType ?? "-"}</p>
            </div>
          </div>
        </div>
      
        {/* Section: Today's Priorities */}
        <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Today's Priorities
            </h2>
            <Link
              href="/revision/intelligence"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          {topPriorities.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No intelligence data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {topPriorities.map((topic, index) => (
                <div
                  key={`${topic.topic}-${index}`}
                  className="border border-gray-100 bg-gray-50 rounded-lg p-4 hover:bg-gray-100/70 transition"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">
                      {topic.priority === "HIGH" ? "🔴" : topic.priority === "MEDIUM" ? "🟡" : "🟢"}{" "}
                      {topic.topic}
                    </h3>
                    <span className="font-bold text-gray-900">
                      {topic.score}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                    <div>Knowledge: {topic.knowledgeScore}%</div>
                    <div>Speed: {topic.speedScore}%</div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {topic.reasons.slice(0, 2).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Practice Performance Panel Widget */}
        <div className="bg-white rounded-xl shadow border p-6 border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Practice Performance
            </h2>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <DashboardAccuracyChart data={accuracyTrend} />
              <DashboardQpmChart data={qpmTrend} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{practiceAnalytics.totalSessions}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{practiceAnalytics.averageAccuracy}%</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Avg QPM</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{practiceAnalytics.averageQPM.toFixed(2)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Speed Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{practiceAnalytics.speedScore}%</p>
                <p className="text-xs text-gray-500 mt-1">Target QPM: 1.67</p>
              </div>
            </div>

            {practiceAnalytics.totalSessions === 0 && (
              <p className="text-sm text-gray-500 mt-4">No practice sessions yet.</p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href="/practice/analytics"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View Practice Analytics →
            </Link>
          </div>
        </div>

        {/* Section: Daily Targets */}
        <div className="bg-white rounded-xl shadow border p-6 border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Daily Target</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Topics / Day</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{dailyTarget.topicsPerDay}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Revisions / Day</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{dailyTarget.revisionsPerDay}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Mocks / Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{dailyTarget.mocksPerWeek}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Study Minutes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{dailyTarget.studyMinutesPerDay}</p>
            </div>
          </div>
        </div>

        {/* Global Progress Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Study Time</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{totalHours}h</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Sessions</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{totalSessions}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Topics</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{completedTopics}/{totalTopics}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{completedTasks}/{totalTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Mock Tests</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{totalMocks}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Avg Accuracy</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{averageAccuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{unreadNotifications}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-700">Syllabus Progress</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{progress.percentage}%</p>
          </div>
        </div>

        {/* Progress Bar Component Section */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Overall Progress</h2>
            <span className="font-semibold text-gray-900">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedTopics} of {totalTopics} topics completed
          </p>
        </div>

        {/* Revision Tracking component */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">Revisions Due Today</h2>
          <p className="text-3xl font-bold text-red-600">{revisionDueToday}</p>
        </div>

        {/* Active Study Routines Engine */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Study Plan</h2>
          <div className="space-y-4">
            {dailyPlan && dailyPlan.length > 0 ? (
              dailyPlan.map((item, index) => {
                // Fixed closure architecture issue: bind server actions statically to distinct parameters
                const handleSessionStart = startStudySession.bind(
                  null,
                  item.subject,
                  item.topic,
                  item.duration
                );

                return (
                  <div
                    key={`${item.topic}-${index}`}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.subject}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{item.topic}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.duration} min</p>
                    </div>
                    <form action={handleSessionStart} className="w-full sm:w-auto">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
                      >
                        Start
                      </button>
                    </form>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No tasks planned for today.</p>
            )}
          </div>
        </div>

        {/* Diagnostic Analytics and Track Record Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Latest Mock Test */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Latest Mock Test</h2>
            {latestMock ? (
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Exam:</span>
                  <span className="font-semibold">{latestMock.exam}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Score:</span>
                  <span className="font-semibold">
                    {latestMock.score}/{latestMock.totalQuestions}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-500">Accuracy:</span>
                  <span className="font-semibold text-blue-600">
                    {latestMock.accuracy.toFixed(1)}%
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No mock tests recorded yet.</p>
            )}
          </div>

          {/* Upcoming Examinations Framework */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Exams</h2>
            <div className="space-y-3">
              {["SBI PO", "IBPS PO", "RRB PO"].map((exam, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 font-medium text-gray-700 bg-gray-50"
                >
                  {exam}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
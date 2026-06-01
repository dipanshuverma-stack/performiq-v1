import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dailyPlan } from "@/lib/daily-plan";
import { startStudySession } from "@/app/actions/study-session";
import { getReadinessScore } from "@/lib/analytics/readiness";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { calculateDailyTarget } from "@/lib/analytics/daily-target";
import { getSyllabusProgress } from "@/lib/analytics/syllabus-progress";

export default async function Dashboard() {
  const session = await auth();

  // Safe fallback lookup using Optional Chaining
  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;

  const userId = user?.id;

  // Parallel and safe async data aggregation fallbacks
  const readiness = userId ? await getReadinessScore(userId) : null;
  const activeExam = userId ? await getActiveExam(userId) : null;

  const daysRemaining = activeExam?.targetDate
    ? Math.ceil((activeExam.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const studySessions = userId
    ? await prisma.studySession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const completedTopics = userId
    ? await prisma.topicProgress.count({
        where: { userId, completed: true },
      })
    : 0;

  const completedTasks = userId
    ? await prisma.task.count({
        where: { userId, completed: true },
      })
    : 0;

  const totalTasks = userId
    ? await prisma.task.count({
        where: { userId },
      })
    : 0;

  const totalMocks = userId
    ? await prisma.mockTest.count({
        where: { userId },
      })
    : 0;

  const averageAccuracyResult = userId
    ? await prisma.mockTest.aggregate({
        where: { userId },
        _avg: { accuracy: true },
      })
    : null;

  const averageAccuracy = averageAccuracyResult?._avg?.accuracy ?? 0;

  const revisionDueToday = userId
    ? await prisma.revision.count({
        where: {
          userId,
          nextRevision: { lte: new Date() },
        },
      })
    : 0;

  const latestMock = userId
    ? await prisma.mockTest.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const revisionRemaining = userId
    ? await prisma.revision.count({
        where: { userId },
      })
    : 0;

  const progress = userId
    ? await getSyllabusProgress(userId)
    : { totalTopics: 0, completedTopics: 0, percentage: "0" };

  const totalTopics = progress.totalTopics;
  const progressPercentage = Number(progress.percentage);
  const topicRemaining = Math.max(0, totalTopics - completedTopics);

  const dailyTarget = calculateDailyTarget(
    daysRemaining ?? 0,
    topicRemaining,
    revisionRemaining
  );

  const unreadNotifications = userId
    ? await prisma.notification.count({
        where: { userId, read: false },
      })
    : 0;

  const totalMinutes = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome {session?.user?.name ?? "Guest"} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {activeExam ? `Preparing for ${activeExam.name}` : "No active exam selected"}
          </p>
        </div>

        {/* Section: Active Exam Core Metrics */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold border-b pb-3 text-gray-800">
            {activeExam?.name ?? "No Active Exam"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Readiness</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{readiness?.readiness ?? 0}%</p>
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

        {/* Section: Daily Targets */}
        <div className="bg-white rounded-xl shadow p-6">
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
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Study Time</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{totalHours}h</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Sessions</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{studySessions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Topics</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{completedTopics}/{totalTopics}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{completedTasks}/{totalTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Mock Tests</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{totalMocks}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Avg Accuracy</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{averageAccuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{unreadNotifications}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">Syllabus Progress</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{progress.percentage}%</p>
          </div>
        </div>

        {/* Progress Bar Component Section */}
        <div className="bg-white p-6 rounded-xl shadow">
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
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-gray-800 mb-2">Revisions Due Today</h2>
          <p className="text-3xl font-bold text-red-600">{revisionDueToday}</p>
        </div>

        {/* Active Study Routines Engine */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Study Plan</h2>
          <div className="space-y-4">
            {dailyPlan && dailyPlan.length > 0 ? (
              dailyPlan.map((item) => (
                <div
                  key={item.topic}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.subject}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{item.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.duration} min</p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await startStudySession(item.subject, item.topic, item.duration);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
                    >
                      Start
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tasks planned for today.</p>
            )}
          </div>
        </div>

        {/* Diagnostic Analytics and Track Record Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Latest Mock Test */}
          <div className="bg-white p-6 rounded-xl shadow">
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
          <div className="bg-white p-6 rounded-xl shadow">
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
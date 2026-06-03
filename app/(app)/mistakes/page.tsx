import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MistakeForm from "@/components/mistakes/mistake-form";
import ResolveButton from "@/components/mistakes/resolve-button";
import { getMistakeAnalytics } from "@/lib/analytics/mistake-analytics";
import { redirect } from "next/navigation";

export default async function MistakesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true, // Performance optimization: retrieve index ID only
    },
  });

  if (!user) {
    redirect("/login");
  }

  // 🚀 COLLAPSE THE WATERFALL: Run analytics computation & bounded database query in parallel
  const [analytics, mistakes] = await Promise.all([
    getMistakeAnalytics(user.id),
    prisma.mistakeEntry.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        subject: true,
        topic: true,
        createdAt: true,
        resolved: true,
        question: true,
        explanation: true,
        source: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Strict performance budget boundary
    }),
  ]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">
        Mistake Journal
      </h1>

      <MistakeForm />

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Mistakes</p>
          <p className="text-3xl font-bold mt-1">{analytics.totalMistakes}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{analytics.resolved}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{analytics.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Resolution Rate</p>
          <p className="text-3xl font-bold mt-1">{analytics.resolutionRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Weakest Subject</p>
          <p className="text-2xl font-bold mt-1 truncate">{analytics.topWeakSubject || "None"}</p>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Subject Breakdown
        </h2>

        {Object.keys(analytics.subjectBreakdown).length === 0 ? (
          <p className="text-gray-500">
            No mistake data available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(analytics.subjectBreakdown).map(([subject, count]) => (
              <div
                key={subject}
                className="border rounded-lg p-4"
              >
                <p className="text-gray-500 text-sm truncate">
                  {subject}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {count}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mistakes List */}
      {mistakes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-3">No Mistakes Logged Yet</h2>
          <p className="text-gray-600 mb-2">Every topper maintains a mistake journal.</p>
          <p className="text-gray-500 mb-6">Record errors from mocks and practice sessions to prevent repeating them.</p>
          <div className="inline-flex px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            You're starting with a clean slate.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="bg-white p-6 rounded-xl shadow border border-gray-100"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {mistake.subject} • {mistake.topic}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(mistake.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                    mistake.resolved ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {mistake.resolved ? "✅ Resolved" : "❌ Pending"}
                  </span>

                  {!mistake.resolved && (
                    <ResolveButton id={mistake.id} />
                  )}
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Mistake description:</p>
                <p className="text-gray-600 mt-1 whitespace-pre-wrap">{mistake.question}</p>
              </div>

              {mistake.explanation && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700">Correct Approach:</p>
                  <p className="text-gray-600 mt-1 whitespace-pre-wrap">{mistake.explanation}</p>
                </div>
              )}

              {mistake.source && (
                <div className="mt-4 text-xs text-gray-400">
                  Source: {mistake.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
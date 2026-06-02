import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MistakeForm from "@/components/mistakes/mistake-form";
import ResolveButton from "@/components/mistakes/resolve-button";
import { getMistakeAnalytics } from "@/lib/analytics/mistake-analytics";

export default async function MistakesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Mistake Journal
        </h1>

        <p className="mt-4 text-gray-500">
          Please sign in to view your mistakes.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Mistake Journal
        </h1>

        <p className="mt-4 text-gray-500">
          User not found.
        </p>
      </div>
    );
  }

  const analytics = await getMistakeAnalytics(user.id);

  const mistakes = await prisma.mistakeEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">
        Mistake Journal
      </h1>

      <MistakeForm />

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Mistakes
          </p>

          <p className="text-3xl font-bold">
            {analytics.totalMistakes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Resolved
          </p>

          <p className="text-3xl font-bold text-green-600">
            {analytics.resolved}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Pending
          </p>

          <p className="text-3xl font-bold text-red-600">
            {analytics.pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Resolution Rate
          </p>

          <p className="text-3xl font-bold">
            {analytics.resolutionRate}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Weakest Subject
          </p>

          <p className="text-2xl font-bold">
            {analytics.topWeakSubject}
          </p>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Subject Breakdown
        </h2>

        {Object.keys(analytics.subjectBreakdown).length === 0 ? (
          <p className="text-gray-500">
            No mistake data available.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(analytics.subjectBreakdown).map(([subject, count]) => (
              <div
                key={subject}
                className="border rounded-lg p-4"
              >
                <p className="text-gray-500 text-sm">
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
          <div className="text-6xl mb-4">
            🎯
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Mistakes Logged Yet
          </h2>

          <p className="text-gray-600 mb-2">
            Every topper maintains a mistake journal.
          </p>

          <p className="text-gray-500 mb-6">
            Record errors from mocks and practice
            sessions to prevent repeating them.
          </p>

          <div className="inline-flex px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            You're starting with a clean slate.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {mistake.subject} •{" "}
                    {mistake.topic}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(mistake.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span>
                    {mistake.resolved
                      ? "✅ Resolved"
                      : "❌ Pending"}
                  </span>

                  {!mistake.resolved && (
                    <ResolveButton id={mistake.id} />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium">
                  Mistake:
                </p>

                <p className="text-gray-700 mt-1">
                  {mistake.question}
                </p>
              </div>

              {mistake.explanation && (
                <div className="mt-4">
                  <p className="font-medium">
                    Correct Approach:
                  </p>

                  <p className="text-gray-600 mt-1">
                    {mistake.explanation}
                  </p>
                </div>
              )}

              {mistake.source && (
                <div className="mt-4 text-sm text-gray-500">
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
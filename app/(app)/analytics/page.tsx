import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSubjectIntelligence } from "@/lib/analytics/subject-intelligence";
import { getMockTrends } from "@/lib/analytics/mock-trends";

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
        <h1 className="text-2xl font-bold">
          User not found
        </h1>
      </div>
    );
  }

  const intelligence =
    await getSubjectIntelligence(user.id);

  const trends =
    await getMockTrends(user.id);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Performance Intelligence
      </h1>

      {/* Subject Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">
            Strongest Subject
          </p>

          <h2 className="text-2xl font-bold text-green-700 mt-2">
            {intelligence.strongestSubject?.subject ??
              "-"}
          </h2>

          <p className="mt-1 text-gray-600">
            Avg Score:{" "}
            {intelligence.strongestSubject
              ?.averageScore ?? 0}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">
            Weakest Subject
          </p>

          <h2 className="text-2xl font-bold text-red-700 mt-2">
            {intelligence.weakestSubject?.subject ??
              "-"}
          </h2>

          <p className="mt-1 text-gray-600">
            Avg Score:{" "}
            {intelligence.weakestSubject
              ?.averageScore ?? 0}
          </p>
        </div>
      </div>

      {/* Mock Trends */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Avg Accuracy
          </p>

          <p className="text-2xl font-bold">
            {trends.averageAccuracy.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Best Accuracy
          </p>

          <p className="text-2xl font-bold text-green-600">
            {trends.bestAccuracy.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Latest Accuracy
          </p>

          <p className="text-2xl font-bold">
            {trends.latestAccuracy.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Improvement
          </p>

          <p
            className={`text-2xl font-bold ${
              trends.improvement >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {trends.improvement.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Subject Intelligence */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Subject Intelligence
          </h2>
        </div>

        {intelligence.subjects.length === 0 ? (
          <div className="p-6 text-gray-500">
            No subject data available yet.
          </div>
        ) : (
          <div className="divide-y">
            {intelligence.subjects.map(
              (subject) => (
                <div
                  key={subject.subject}
                  className="p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {subject.subject}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Mocks Attempted:{" "}
                      {subject.mocks}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      Avg Score:{" "}
                      {subject.averageScore}
                    </p>

                    <p className="text-sm text-gray-500">
                      Avg Accuracy:{" "}
                      {subject.averageAccuracy}%
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
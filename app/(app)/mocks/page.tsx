import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MockForm from "@/components/mock/mock-form";
import { redirect } from "next/navigation";
import { SmartLink as Link } from "@/components/smart-link";

export default async function MocksPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Collapsed nested query: Fetches user metadata and relational array fields in one trip
  const userWithMocks = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      mockTests: {
        select: {
          id: true,
          exam: true,
          mockType: true,
          title: true,
          score: true,
          accuracy: true,
          totalQuestions: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!userWithMocks) {
    redirect("/login");
  }

  const mocks = userWithMocks.mockTests;
  const totalMocks = mocks.length;

  // Single-Pass High-Speed O(n) Matrix Reducer Loop
  const { totalAccuracy, bestAccuracy, prelimsMocks, mainsMocks } = mocks.reduce(
    (accumulator, currentMock) => {
      accumulator.totalAccuracy += currentMock.accuracy;
      
      if (currentMock.accuracy > accumulator.bestAccuracy) {
        accumulator.bestAccuracy = currentMock.accuracy;
      }
      
      if (currentMock.mockType === "PRELIMS") {
        accumulator.prelimsMocks += 1;
      } else if (currentMock.mockType === "MAINS") {
        accumulator.mainsMocks += 1;
      }
      
      return accumulator;
    },
    { totalAccuracy: 0, bestAccuracy: 0, prelimsMocks: 0, mainsMocks: 0 }
  );

  const averageAccuracy = totalMocks > 0 ? totalAccuracy / totalMocks : 0;

  const bestScore =
    mocks.length > 0
      ? Math.max(...mocks.map((m) => m.score))
      : 0;

  const averageScore =
    mocks.length > 0
      ? mocks.reduce((sum, m) => sum + m.score, 0) /
        mocks.length
      : 0;

  const latestMock = mocks[0];

  const performanceLevel =
    averageAccuracy >= 80
      ? "Advanced"
      : averageAccuracy >= 65
      ? "Intermediate"
      : "Beginner";

  const targetAccuracy = Math.min(
    90,
    Math.round(averageAccuracy + 5)
  );

  const confidenceScore = Math.min(
    100,
    Math.round(averageAccuracy * 1.1)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mock Tests Analytics
        </h1>
        <p className="text-gray-500 mt-2">
          Track execution accuracy profiles, test milestones, and analytical diagnostic breakdowns.
        </p>
      </div>

      {totalMocks === 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4 text-gray-400 select-none">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Mock Tests Recorded Yet
            </h2>
            <p className="text-gray-600 max-w-md mx-auto text-sm mb-6">
              Record your first mock test execution below to generate core target insights, accuracy statistics, and readiness scores.
            </p>
          </div>
          <MockForm />
        </div>
      ) : (
        <>
          {/* Summary Callout Banner */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-6">
            <h2 className="font-semibold text-blue-900 text-base mb-1">
              Performance Summary Profile
            </h2>
            <p className="text-blue-800 text-sm leading-relaxed">
              You have completed <span className="font-bold">{totalMocks}</span> diagnostic mocks with an aggregate accuracy threshold running at <span className="font-bold">{averageAccuracy.toFixed(1)}%</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Best Score
              </p>
              <p className="text-3xl font-bold mt-2">
                {bestScore}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Avg Score
              </p>
              <p className="text-3xl font-bold mt-2">
                {averageScore.toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Target Accuracy
              </p>
              <p className="text-3xl font-bold mt-2 text-blue-600">
                {targetAccuracy}%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Confidence Score
              </p>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {confidenceScore}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Mock Intelligence
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600">
                  Performance Level
                </p>

                <p className="text-xl font-bold mt-2">
                  {performanceLevel}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600">
                  Latest Accuracy
                </p>

                <p className="text-xl font-bold mt-2">
                  {latestMock?.accuracy.toFixed(1) ?? 0}%
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-600">
                  Total Mocks
                </p>

                <p className="text-xl font-bold mt-2">
                  {totalMocks}
                </p>
              </div>
            </div>
          </div>

          {/* Optimized Metrics Data Dashboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Total Mocks</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalMocks}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Avg Accuracy</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{averageAccuracy.toFixed(1)}%</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Best Accuracy</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{bestAccuracy.toFixed(1)}%</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Prelims Type</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{prelimsMocks}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Mains Type</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mainsMocks}</p>
            </div>
          </div>

          <MockForm />

          {/* Historical Logs List Layout */}
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">
                Mock Performance History
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {mocks.map((mock, idx) => (
                <div
                  key={`${mock.id}-${idx}`}
                  className="p-5 flex justify-between items-center hover:bg-gray-50/40 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {mock.exam}
                      </h3>
                      <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">
                        {mock.mockType}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      {new Date(mock.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>

                    {mock.title && (
                      <p className="text-sm text-gray-600 max-w-prose line-clamp-1">
                        {mock.title}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {mock.score} <span className="text-xs text-gray-400 font-normal">/ {mock.totalQuestions}</span>
                    </p>
                    <p className="text-sm text-green-600 font-bold">
                      {mock.accuracy.toFixed(1)}%
                    </p>
                    <Link
                      href={`/mocks/${mock.id}`}
                      className="inline-block text-xs text-blue-600 font-semibold hover:underline pt-1"
                    >
                      View Report →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
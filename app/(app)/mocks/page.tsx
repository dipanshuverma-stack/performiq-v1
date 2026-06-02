import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MockForm from "@/components/mock/mock-form";

export default async function MocksPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const mocks = await prisma.mockTest.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalMocks = mocks.length;

  const averageAccuracy =
    mocks.length > 0
      ? mocks.reduce(
          (sum, mock) => sum + mock.accuracy,
          0
        ) / mocks.length
      : 0;

  const bestAccuracy =
    mocks.length > 0
      ? Math.max(...mocks.map((m) => m.accuracy))
      : 0;

  const prelimsMocks = mocks.filter(
    (m) => m.mockType === "PRELIMS"
  ).length;

  const mainsMocks = mocks.filter(
    (m) => m.mockType === "MAINS"
  ).length;

  const hasMocks = mocks.length > 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Mock Tests
      </h1>

      {!hasMocks ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-6xl mb-4">
              📝
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No Mock Tests Recorded Yet
            </h2>

            <p className="text-gray-600 mb-2">
              Mock tests are the strongest predictor
              of exam performance.
            </p>

            <p className="text-gray-500 mb-6">
              Record your first mock test to unlock
              readiness scores, performance forecasts,
              analytics, and intelligent recommendations.
            </p>
          </div>

          <MockForm />
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <div className="bg-blue-50 border rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-2 text-blue-900">
              Mock Performance Summary
            </h2>

            <p className="text-blue-800">
              You've completed {totalMocks} mock tests with an average accuracy of{" "}
              {averageAccuracy.toFixed(1)}%.
            </p>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">
                Total Mocks
              </h3>
              <p className="text-3xl font-bold mt-2">
                {totalMocks}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">
                Avg Accuracy
              </h3>
              <p className="text-3xl font-bold mt-2">
                {averageAccuracy.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">
                Best Accuracy
              </h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {bestAccuracy.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">
                Prelims
              </h3>
              <p className="text-3xl font-bold mt-2">
                {prelimsMocks}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">
                Mains
              </h3>
              <p className="text-3xl font-bold mt-2">
                {mainsMocks}
              </p>
            </div>
          </div>

          <MockForm />

          {/* History Block Container */}
          <div className="bg-white rounded-xl shadow overflow-hidden mt-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Mock History
              </h2>
            </div>

            <div className="divide-y">
              {mocks.map((mock) => (
                <div
                  key={mock.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {mock.exam}
                      </h3>

                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {mock.mockType}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {new Date(mock.createdAt).toLocaleDateString()}
                    </p>

                    {mock.title && (
                      <p className="text-sm text-gray-600">
                        {mock.title}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {mock.score}/{mock.totalQuestions}
                    </p>

                    <p className="text-green-600 font-semibold">
                      {mock.accuracy.toFixed(1)}%
                    </p>
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
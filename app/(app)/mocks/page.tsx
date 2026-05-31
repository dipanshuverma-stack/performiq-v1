import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createMockTest } from "@/app/actions/mock-test";

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
      ? Math.max(
          ...mocks.map((mock) => mock.accuracy)
        )
      : 0;

  const latestMock =
    mocks.length > 0 ? mocks[0] : null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Mock Tests
      </h1>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            Latest Score
          </h3>

          <p className="text-3xl font-bold mt-2">
            {latestMock
              ? `${latestMock.score}/${latestMock.totalQuestions}`
              : "-"}
          </p>
        </div>
      </div>

      {/* Add Mock Form */}
      <form
        action={createMockTest}
        className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <input
          name="exam"
          placeholder="Exam Name (SBI PO)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="score"
          placeholder="Correct Answers"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="totalQuestions"
          placeholder="Total Questions"
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Save Mock Test
        </button>
      </form>

      {/* Mock History */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Mock Test History
          </h2>
        </div>

        {mocks.length === 0 ? (
          <div className="p-6 text-gray-500">
            No mock tests recorded yet.
          </div>
        ) : (
          <div className="divide-y">
            {mocks.map((mock) => (
              <div
                key={mock.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {mock.exam}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      mock.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {mock.score}/
                    {mock.totalQuestions}
                  </p>

                  <p className="text-green-600 font-semibold">
                    {mock.accuracy.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
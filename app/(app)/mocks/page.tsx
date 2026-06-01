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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Mock Tests
      </h1>

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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Mock History
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
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {mock.exam}
                    </h3>

                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {mock.mockType}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      mock.createdAt
                    ).toLocaleDateString()}
                  </p>

                  {mock.title && (
                    <p className="text-sm text-gray-600">
                      {mock.title}
                    </p>
                  )}
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
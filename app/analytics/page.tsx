import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const completedTopics = await prisma.topicProgress.count({
    where: {
      userId: user?.id,
      completed: true,
    },
  });

  const totalStudySessions =
    await prisma.studySession.count({
      where: {
        userId: user?.id,
      },
    });

  const studySessions =
    await prisma.studySession.findMany({
      where: {
        userId: user?.id,
      },
    });

  const totalMinutes = studySessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const totalHours = (
    totalMinutes / 60
  ).toFixed(1);

  const totalMocks = await prisma.mockTest.count({
    where: {
      userId: user?.id,
    },
  });

  const averageAccuracyResult =
    await prisma.mockTest.aggregate({
      where: {
        userId: user?.id,
      },
      _avg: {
        accuracy: true,
      },
    });

  const averageAccuracy =
    averageAccuracyResult._avg.accuracy ?? 0;

  const pendingRevisions =
    await prisma.revision.count({
      where: {
        userId: user?.id,
      },
    });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Study Hours
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalHours}h
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Study Sessions
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalStudySessions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Topics Completed
          </h3>

          <p className="text-3xl font-bold mt-2">
            {completedTopics}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Mock Tests Taken
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalMocks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Average Accuracy
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {averageAccuracy.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Pending Revisions
          </h3>

          <p className="text-3xl font-bold mt-2">
            {pendingRevisions}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Performance Summary
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>
            📚 Topics Completed:{" "}
            {completedTopics}
          </li>

          <li>
            ⏱ Total Study Hours:{" "}
            {totalHours}
          </li>

          <li>
            📝 Mock Tests Taken:{" "}
            {totalMocks}
          </li>

          <li>
            🎯 Average Accuracy:{" "}
            {averageAccuracy.toFixed(1)}%
          </li>

          <li>
            🔄 Pending Revisions:{" "}
            {pendingRevisions}
          </li>
        </ul>
      </div>
    </div>
  );
}
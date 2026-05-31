import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
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

  const completedTasks = await prisma.task.count({
    where: {
      userId: user?.id,
      completed: true,
    },
  });

  const studySessions = await prisma.studySession.findMany({
    where: {
      userId: user?.id,
    },
  });

  const mockTests = await prisma.mockTest.findMany({
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

  const averageAccuracy =
    mockTests.length > 0
      ? (
          mockTests.reduce(
            (sum, mock) => sum + mock.accuracy,
            0
          ) / mockTests.length
        ).toFixed(1)
      : "0";

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">
              Name
            </p>

            <p className="font-semibold text-lg">
              {user?.name || "Unknown User"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {user?.email}
            </p>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-gray-500">
                Topics Completed
              </p>

              <p className="text-2xl font-bold">
                {completedTopics}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-gray-500">
                Study Hours
              </p>

              <p className="text-2xl font-bold">
                {totalHours}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-gray-500">
                Tasks Completed
              </p>

              <p className="text-2xl font-bold">
                {completedTasks}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-gray-500">
                Mock Tests Taken
              </p>

              <p className="text-2xl font-bold">
                {mockTests.length}
              </p>
            </div>

            <div className="border rounded-lg p-4 md:col-span-2">
              <p className="text-gray-500">
                Average Accuracy
              </p>

              <p className="text-2xl font-bold text-green-600">
                {averageAccuracy}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
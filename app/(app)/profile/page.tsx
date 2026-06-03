import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // 🚀 COLLAPSE WATERFALL & OFFLOAD CALCULATIONS TO DATABASE AGGREGATION ENGINE
  const [
    completedTopics,
    completedTasks,
    studySessionsSum,
    mockTestsAggregate,
  ] = await Promise.all([
    prisma.topicProgress.count({
      where: { userId: user.id, completed: true },
    }),
    prisma.task.count({
      where: { userId: user.id, completed: true },
    }),
    prisma.studySession.aggregate({
      where: { userId: user.id },
      _sum: { duration: true },
    }),
    prisma.mockTest.aggregate({
      where: { userId: user.id },
      _count: { _all: true },
      _avg: { accuracy: true },
    }),
  ]);

  // Compute values safely from the single aggregate object metrics returned
  const totalMinutes = studySessionsSum._sum.duration ?? 0;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const mockTestsCount = mockTestsAggregate._count._all;
  const averageAccuracy = mockTestsAggregate._avg.accuracy 
    ? mockTestsAggregate._avg.accuracy.toFixed(1) 
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
              {user.name || "Unknown User"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {user.email}
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
                {mockTestsCount}
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
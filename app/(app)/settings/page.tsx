import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  // 1. Authenticate session
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Fetch the user profile (selecting only necessary columns)
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

  // 3. COLLAPSE WATERFALL: Run all counts concurrently in parallel
  const [totalTopics, totalTasks, totalMocks, totalRevisions] = await Promise.all([
    prisma.topicProgress.count({
      where: { userId: user.id },
    }),
    prisma.task.count({
      where: { userId: user.id },
    }),
    prisma.mockTest.count({
      where: { userId: user.id },
    }),
    prisma.revision.count({
      where: { userId: user.id },
    }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      {/* Account */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Account Information
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-gray-500">
              Name
            </p>

            <p className="font-medium">
              {user.name || "Unknown User"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Your Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Topics
            </p>

            <p className="text-2xl font-bold">
              {totalTopics}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Tasks
            </p>

            <p className="text-2xl font-bold">
              {totalTasks}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Mock Tests
            </p>

            <p className="text-2xl font-bold">
              {totalMocks}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Revisions
            </p>

            <p className="text-2xl font-bold">
              {totalRevisions}
            </p>
          </div>
        </div>
      </div>

      {/* Future Settings */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Preferences
        </h2>

        <p className="text-gray-600">
          Dark mode, notifications, and AI
          personalization will be available in
          future updates.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Danger Zone
        </h2>

        <p className="text-red-600">
          Account deletion and full progress reset
          will be added in a future release.
        </p>
      </div>
    </div>
  );
}
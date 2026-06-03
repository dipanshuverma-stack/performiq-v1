import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

// ==========================================
// 0. CACHE ENGINE (DEFINED OUTSIDE SCOPE)
// ==========================================
const getCachedSettingsStats = unstable_cache(
  async (userId: string) => {
    const [totalTopics, totalTasks, totalMocks, totalRevisions] = await Promise.all([
      prisma.topicProgress.count({
        where: { userId },
      }),
      prisma.task.count({
        where: { userId },
      }),
      prisma.mockTest.count({
        where: { userId },
      }),
      prisma.revision.count({
        where: { userId },
      }),
    ]);

    return { totalTopics, totalTasks, totalMocks, totalRevisions };
  },
  ["user-settings-stats"],
  { revalidate: 300, tags: ["stats"] } // Cache queries for 5 minutes
);

// ==========================================
// 1. HEAVY SUB-COMPONENT (STREAMS IN LATER)
// ==========================================
async function StatisticsGrid({ userId }: { userId: string }) {
  // Safe extraction from the background data cache provider
  const { totalTopics, totalTasks, totalMocks, totalRevisions } = await getCachedSettingsStats(userId);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4">
        <p className="text-gray-500 text-sm">Topics</p>
        <p className="text-2xl font-bold">{totalTopics}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500 text-sm">Tasks</p>
        <p className="text-2xl font-bold">{totalTasks}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500 text-sm">Mock Tests</p>
        <p className="text-2xl font-bold">{totalMocks}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500 text-sm">Revisions</p>
        <p className="text-2xl font-bold">{totalRevisions}</p>
      </div>
    </div>
  );
}

// ==========================================
// 2. LOADING STATE SKELETON
// ==========================================
function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-gray-50/70 h-[88px] flex flex-col justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-8" />
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 3. MAIN PAGE LAYER (LOADS INSTANTLY)
// ==========================================
export default async function SettingsPage() {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Account Info - Instant Load */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{user.name || "Unknown User"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Statistics Box with Suspense Boundary */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
        
        <Suspense fallback={<StatisticsSkeleton />}>
          <StatisticsGrid userId={user.id} />
        </Suspense>
      </div>

      {/* Preferences - Instant Load */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-600">
          Dark mode, notifications, and AI personalization will be available in future updates.
        </p>
      </div>

      {/* Danger Zone - Instant Load */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-red-600">
          Account deletion and full progress reset will be added in a future release.
        </p>
      </div>
    </div>
  );
}
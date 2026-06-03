import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

// ==========================================
// 0. CACHE ENGINE (DEFINED OUTSIDE SCOPE)
// ==========================================
const getCachedProfileStats = unstable_cache(
  async (userId: string) => {
    const [
      completedTopics,
      completedTasks,
      studySessionsSum,
      mockTestsAggregate,
    ] = await Promise.all([
      prisma.topicProgress.count({
        where: { userId, completed: true },
      }),
      prisma.task.count({
        where: { userId, completed: true },
      }),
      prisma.studySession.aggregate({
        where: { userId },
        _sum: { duration: true },
      }),
      prisma.mockTest.aggregate({
        where: { userId },
        _count: { _all: true },
        _avg: { accuracy: true },
      }),
    ]);

    return {
      completedTopics,
      completedTasks,
      studySessionsSum,
      mockTestsAggregate,
    };
  },
  ["user-profile-stats"],
  { revalidate: 300, tags: ["stats"] } // Cache queries for 5 minutes
);

// ==========================================
// 1. HEAVY ANALYTICS COMPONENT (STREAMS IN)
// ==========================================
async function ProfileStatsGrid({ userId }: { userId: string }) {
  // Read safely from the cached data engine 
  const data = await getCachedProfileStats(userId);

  // Compute metric values safely from the single aggregate object returned
  const totalMinutes = data.studySessionsSum._sum.duration ?? 0;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const mockTestsCount = data.mockTestsAggregate._count._all;
  const averageAccuracy = data.mockTestsAggregate._avg.accuracy 
    ? data.mockTestsAggregate._avg.accuracy.toFixed(1) 
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Topics Completed</p>
        <p className="text-2xl font-bold">{data.completedTopics}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Study Hours</p>
        <p className="text-2xl font-bold">{totalHours}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Tasks Completed</p>
        <p className="text-2xl font-bold">{data.completedTasks}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Mock Tests Taken</p>
        <p className="text-2xl font-bold">{mockTestsCount}</p>
      </div>

      <div className="border rounded-lg p-4 md:col-span-2">
        <p className="text-gray-500">Average Accuracy</p>
        <p className="text-2xl font-bold text-green-600">{averageAccuracy}%</p>
      </div>
    </div>
  );
}

// ==========================================
// 2. LOADING PLACEHOLDER (PREVENTS CLS)
// ==========================================
function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-gray-50/80 h-[88px] flex flex-col justify-between">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-6 bg-gray-200 rounded w-12" />
        </div>
      ))}
      <div className="border rounded-lg p-4 md:col-span-2 bg-gray-50/80 h-[88px] flex flex-col justify-between">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN PAGE COMPONENT (LOADS INSTANTLY)
// ==========================================
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold text-lg">{user.name || "Unknown User"}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <hr />

          {/* Suspense boundary unblocks page shell rendering */}
          <Suspense fallback={<ProfileStatsSkeleton />}>
            <ProfileStatsGrid userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
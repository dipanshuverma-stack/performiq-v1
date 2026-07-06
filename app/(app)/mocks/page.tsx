// app/mocks/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { startTimer, endTimer } from "@/lib/perf";

import { buildMockAnalytics } from "@/lib/mock/mock-analytics";
import MockDashboard from "@/components/mock/MockDashboard";

// Optimized: Queries MockTest table directly using the userId
const cachedGetMocks = cache(async (userId: string) => {
  const tQuery = startTimer();

  const mocks = await prisma.mockTest.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      exam: true,
      mockType: true,
      title: true,
      score: true,
      accuracy: true,
      totalQuestions: true,
      createdAt: true,
      subjectPerformances: {
        select: {
          subject: true,
          accuracy: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  /* -------------------------------------------------------------
     STEP 3: Bottleneck Isolation Test Block
     If troubleshooting latencies, comment out the findMany above 
     and uncomment this minimal query block:
     
     const mocks = await prisma.mockTest.findMany({
       where: { userId },
       select: { id: true },
       take: 50,
     });
     ------------------------------------------------------------- */

  endTimer("findMocks", tQuery);
  return mocks;
});

export default async function MocksPage() {
  // 1. Measure Auth Performance Safely
  const tAuth = startTimer();
  const session = await auth();
  endTimer("auth", tAuth);

  // Safely extract userId (extending NextAuth types contextually if needed)
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  // 2. Measure Optimized Direct DB Fetch
  const mocks = await cachedGetMocks(userId);

  // 3. Measure Analytics Processing Performance
  const tAnalytics = startTimer();
  const analytics = buildMockAnalytics(mocks);
  endTimer("analytics", tAnalytics);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mock Tests</h1>
        <p className="text-slate-400 mt-2">Analyze your performance across all mocks</p>
      </div>

      <MockDashboard mocks={mocks} analytics={analytics} />
    </div>
  );
}
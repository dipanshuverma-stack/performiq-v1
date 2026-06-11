import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Prisma, RevisionStatus } from "@prisma/client";
import { HistorySummary } from "@/components/practice/history/history-summary";
import { HistorySearch } from "@/components/practice/history/HistorySearch";
import { HistoryFilters } from "@/components/practice/history/HistoryFilters";
import { HistoryTimeline } from "@/components/practice/history/HistoryTimeline";
import { HistoryEmpty } from "@/components/practice/history/history-empty";
import { SubjectStats } from "@/components/practice/history/SubjectStats";
import { WeakTopics } from "@/components/practice/history/WeakTopics";

interface HistoryPageProps {
  searchParams: Promise<{
    search?: string;
    subject?: string;
    status?: string;
    sortBy?: string;
  }>;
}

// ✅ Explicit compile-time literal validation without type widening erosion
const SORT_MAP = {
  createdAt_DESC: { createdAt: "desc" },
  createdAt_ASC: { createdAt: "asc" },
  accuracy_DESC: { accuracy: "desc" },
  accuracy_ASC: { accuracy: "asc" },
  qpm_DESC: { qpm: "desc" },
  qpm_ASC: { qpm: "asc" },
} satisfies Record<string, Prisma.PracticeSessionOrderByWithRelationInput>;

export default async function PracticeHistoryPage({ searchParams }: HistoryPageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const resolvedParams = await searchParams;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/login");

  const filtersConditions: Prisma.PracticeSessionWhereInput = {
    userId: user.id,
    ...(resolvedParams.subject && resolvedParams.subject !== "All" && { subject: resolvedParams.subject }),
    ...(resolvedParams.status && resolvedParams.status !== "All" && { 
      revisionStatus: resolvedParams.status as RevisionStatus 
    }),
    ...(resolvedParams.search && { topic: { contains: resolvedParams.search, mode: "insensitive" } }),
  };

  const orderByCondition = SORT_MAP[resolvedParams.sortBy as keyof typeof SORT_MAP] || { createdAt: "desc" };

  const [sessions, aggregates, subjectGroups, weakTopicGroups] = await Promise.all([
    prisma.practiceSession.findMany({
      where: filtersConditions,
      orderBy: orderByCondition,
      take: 50,
    }),
    prisma.practiceSession.aggregate({
      where: filtersConditions,
      _count: { id: true },
      _sum: { totalQuestions: true },
      _avg: { accuracy: true, qpm: true },
    }),
    prisma.practiceSession.groupBy({
      by: ["subject"],
      where: filtersConditions,
      _count: { id: true },
      _avg: { accuracy: true },
    }),
    prisma.practiceSession.groupBy({
      by: ["topic"],
      where: { userId: user.id, mistakeCount: { gt: 0 } },
      _sum: { mistakeCount: true },
      orderBy: { _sum: { mistakeCount: "desc" } },
      take: 5,
    }),
  ]);

  const summaryMetrics = {
    totalSessions: aggregates._count.id ?? 0,
    totalQuestions: aggregates._sum.totalQuestions ?? 0,
    averageAccuracy: aggregates._avg.accuracy ?? 0,
    averageQpm: aggregates._avg.qpm ?? 0,
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Practice History</h1>
        <p className="text-sm text-gray-500 mt-1">Review diagnostic timelines and velocity analytics records.</p>
      </div>

      <HistorySummary metrics={summaryMetrics} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <HistorySearch />
          <HistoryFilters />
          
          {sessions.length === 0 ? (
            <HistoryEmpty />
          ) : (
            <HistoryTimeline sessions={sessions} />
          )}
        </div>

        <div className="space-y-4 h-fit sticky top-6">
          <SubjectStats stats={subjectGroups} />
          <WeakTopics topics={weakTopicGroups} />
        </div>
      </div>
    </div>
  );
}
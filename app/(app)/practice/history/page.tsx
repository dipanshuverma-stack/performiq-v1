import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { Prisma, RevisionStatus } from "@prisma/client";

import { getPracticeHistory } from "@/lib/practice/get-practice-history";
import { HistorySummary } from "@/components/practice/history/history-summary";
import { HistorySearch } from "@/components/practice/history/HistorySearch";
import { HistoryFilters } from "@/components/practice/history/HistoryFilters";
import { HistoryTimeline } from "@/components/practice/history/HistoryTimeline";
import { HistoryEmpty } from "@/components/practice/history/history-empty";
import { SubjectStats } from "@/components/practice/history/SubjectStats";
import { WeakTopics } from "@/components/practice/history/WeakTopics";
import { SUBJECT_MAP } from "@/config/subjects";

const ITEMS_PER_PAGE = 20;

const cachedGetUser = cache(async (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
);

const SORT_MAP = {
  createdAt_DESC: { createdAt: "desc" },
  createdAt_ASC: { createdAt: "asc" },
  accuracy_DESC: { accuracy: "desc" },
  accuracy_ASC: { accuracy: "asc" },
  qpm_DESC: { qpm: "desc" },
  qpm_ASC: { qpm: "asc" },
} satisfies Record<string, Prisma.PracticeSessionOrderByWithRelationInput>;

export default async function PracticeHistoryPage({ searchParams }: { 
  searchParams: Promise<{ search?: string; subject?: string; status?: string; sortBy?: string; }> 
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const resolvedParams = await searchParams;

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  const userId = user.id;

  const filtersConditions: Prisma.PracticeSessionWhereInput = {
    userId,
    ...(resolvedParams.subject && resolvedParams.subject !== "All" && {
      subject: SUBJECT_MAP[resolvedParams.subject]
    }),
    ...(resolvedParams.status && resolvedParams.status !== "All" && {
      revisionStatus: resolvedParams.status as RevisionStatus
    }),
    ...(resolvedParams.search && {
      topic: { contains: resolvedParams.search, mode: "insensitive" }
    }),
  };

  const orderByCondition = SORT_MAP[resolvedParams.sortBy as keyof typeof SORT_MAP] || { createdAt: "desc" };

  const [historyResult, aggregates, subjectGroups, weakTopicGroups] = await Promise.all([
    getPracticeHistory({
      where: filtersConditions,
      orderBy: orderByCondition,
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
      where: { userId, mistakeCount: { gt: 0 } },
      _sum: { mistakeCount: true },
      orderBy: { _sum: { mistakeCount: "desc" } },
      take: 5,
    }),
  ]);

  const { sessions } = historyResult;

  const summaryMetrics = {
    totalSessions: aggregates._count.id ?? 0,
    totalQuestions: aggregates._sum.totalQuestions ?? 0,
    averageAccuracy: aggregates._avg.accuracy ?? 0,
    averageQpm: aggregates._avg.qpm ?? 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Practice History</h1>
        <p className="text-slate-400 mt-2">Review your practice sessions and performance patterns</p>
      </div>

      <HistorySummary metrics={summaryMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <HistorySearch />
          <HistoryFilters />

          {sessions.length === 0 ? (
            <HistoryEmpty />
          ) : (
            <HistoryTimeline sessions={sessions} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <SubjectStats stats={subjectGroups} />
          <WeakTopics topics={weakTopicGroups} />
        </div>
      </div>
    </div>
  );
}
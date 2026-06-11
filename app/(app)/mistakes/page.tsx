import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { getMistakeAnalytics } from "@/lib/analytics/mistake-analytics";
import { MistakeSummary } from "@/components/mistakes/MistakeSummary";
import { MistakeSearch } from "@/components/mistakes/MistakeSearch";
import { MistakeFilters } from "@/components/mistakes/MistakeFilters";
import { MistakeList } from "@/components/mistakes/MistakeList";
import { MistakePagination } from "@/components/mistakes/MistakePagination";

interface MistakesPageProps {
  searchParams: Promise<{
    search?: string;
    subject?: string;
    status?: string;
    sortBy?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

const SORT_MAP = {
  createdAt_DESC: [{ createdAt: "desc" }],
  createdAt_ASC: [{ createdAt: "asc" }],
  pending_FIRST: [{ resolved: "asc" }, { createdAt: "desc" }],
} satisfies Record<string, Prisma.MistakeEntryOrderByWithRelationInput[]>;

export default async function MistakesPage({ searchParams }: MistakesPageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedParams.page || 1));

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/login");

  const filtersConditions: Prisma.MistakeEntryWhereInput = {
    userId: user.id,
    ...(resolvedParams.subject && resolvedParams.subject !== "All" && { subject: resolvedParams.subject }),
    ...(resolvedParams.status && resolvedParams.status !== "All" && {
      resolved: resolvedParams.status === "RESOLVED",
    }),
    ...(resolvedParams.search && {
      OR: [
        { topic: { contains: resolvedParams.search, mode: "insensitive" } },
        { question: { contains: resolvedParams.search, mode: "insensitive" } },
      ],
    }),
  };

  const orderByCondition = SORT_MAP[resolvedParams.sortBy as keyof typeof SORT_MAP] || SORT_MAP.createdAt_DESC;

  // Parallel Evaluation Window Matrix Fetch
  const [analytics, totalCount, mistakes, totalPendingCount] = await Promise.all([
    getMistakeAnalytics(user.id), // Contains streak telemetry data
    prisma.mistakeEntry.count({ where: filtersConditions }),
    prisma.mistakeEntry.findMany({
      where: filtersConditions,
      select: {
        id: true,
        subject: true,
        topic: true,
        createdAt: true,
        resolved: true,
        question: true,
        explanation: true,
        source: true,
        difficulty: true,
        confidenceScore: true,
        notes: true,
      },
      orderBy: orderByCondition,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.mistakeEntry.count({
      where: { userId: user.id, resolved: false },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">📚 Mistake Book</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review, isolate, and eliminate recurring failure points across target evaluation domains.
        </p>
      </div>

      <MistakeSummary 
        analytics={analytics} 
        pendingReviewCount={totalPendingCount} 
      />

      <div className="space-y-3">
        <MistakeSearch />
        <MistakeFilters />
      </div>

      <MistakeList initialMistakes={mistakes} />

      {totalPages > 1 && (
        <MistakePagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
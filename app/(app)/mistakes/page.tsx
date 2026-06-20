import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { SUBJECT_MAP } from "@/config/subjects";
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

// Single, authoritative model delegate source of truth
const dbDelegate = prisma.mistakeEntry;

const ITEMS_PER_PAGE = 20;

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

  // 1. Properly target mistakeEntry's filter type parameters
  const subjectParam = resolvedParams.subject;
  let mappedSubject: Prisma.MistakeEntryWhereInput["subject"] | undefined;

  // 2. Safe, context-guarded lookup without trailing type assertions
  if (subjectParam && subjectParam !== "All" && subjectParam in SUBJECT_MAP) {
    mappedSubject = SUBJECT_MAP[subjectParam as keyof typeof SUBJECT_MAP];
  }

  // 3. Build query filters bounded cleanly to MistakeEntry definitions
  const filtersConditions: Prisma.MistakeEntryWhereInput = {
    userId: user.id,
    
    ...(mappedSubject && {
      subject: mappedSubject,
    }),

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

  const [analytics, totalCount, rawMistakes, totalPendingCount] = await Promise.all([
    getMistakeAnalytics(user.id), 
    dbDelegate.count({ where: filtersConditions }),
    dbDelegate.findMany({
      where: filtersConditions,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    dbDelegate.count({
      where: { userId: user.id, resolved: false },
    }),
  ]);

  // 4. Serialize matching exactly what MistakeEntry provides, ensuring no nulls leak into required string fields
  const serializedMistakes = rawMistakes.map((m) => ({
    id: m.id,
    subject: m.subject,
    topic: m.topic ?? "General",
    createdAt: m.createdAt,
    resolved: m.resolved,
    question: m.question,
    explanation: m.explanation ?? "",
    source: m.source ?? "",
    difficulty: m.difficulty,
  }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6 text-zinc-100 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">📚 Mistake Book</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review, isolate, and eliminate recurring failure points across target evaluation domains.
        </p>
      </div>

      <MistakeSummary analytics={analytics} pendingReviewCount={totalPendingCount} />

      <div className="space-y-3">
        <MistakeSearch />
        <MistakeFilters />
      </div>

      <MistakeList initialMistakes={serializedMistakes} />

      {totalPages > 1 && (
        <MistakePagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
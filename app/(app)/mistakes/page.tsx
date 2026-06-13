import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
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

  // Dynamically target the model delegate whether it's named 'mistake', 'mistakeEntry', or 'mistakes'
  const dbDelegate = (prisma as any).mistake || (prisma as any).mistakeEntry || (prisma as any).mistakes;

  if (!dbDelegate) {
    return <div className="p-8 text-zinc-400">Error: Mistake database model delegate missing from prisma schema definition.</div>;
  }

  const filtersConditions: any = {
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

  const serializedMistakes = rawMistakes.map((m: any) => ({
    id: m.id,
    subject: m.subject || "Quantitative Aptitude",
    topic: m.topic || m.topic || "General",
    createdAt: m.createdAt,
    resolved: m.resolved,
    question: m.question || "",
    explanation: m.explanation || "",
    source: m.source || "",
    confidenceScore: m.confidenceScore || 3,
    notes: m.notes || "",
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
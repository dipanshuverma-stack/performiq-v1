import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { Prisma } from "@prisma/client";

import { SUBJECT_MAP } from "@/config/subjects";
import { getMistakeAnalytics } from "@/lib/analytics/mistake-analytics";
import { MistakesContent } from "@/components/mistakes/MistakesContent";

const ITEMS_PER_PAGE = 20;

const cachedGetMistakeAnalytics = cache(async (userId: string) => 
  getMistakeAnalytics(userId)
);

const cachedGetUser = cache(async (email: string) => 
  prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
);

export default async function MistakesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedParams.page || 1));

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  const subjectParam = resolvedParams.subject;
  const mappedSubject = subjectParam && subjectParam !== "All" && subjectParam in SUBJECT_MAP 
    ? SUBJECT_MAP[subjectParam as keyof typeof SUBJECT_MAP] 
    : undefined;

  const filtersConditions: Prisma.MistakeEntryWhereInput = {
    userId: user.id,
    ...(mappedSubject && { subject: mappedSubject }),
    ...(resolvedParams.status && resolvedParams.status !== "All" && { 
      resolved: resolvedParams.status === "RESOLVED" 
    }),
    ...(resolvedParams.search && {
      OR: [
        { topic: { contains: resolvedParams.search, mode: "insensitive" } },
        { question: { contains: resolvedParams.search, mode: "insensitive" } },
      ],
    }),
  };

  // Parallel heavy queries
  const [analytics, totalCount, rawMistakes, totalPendingCount] = await Promise.all([
    cachedGetMistakeAnalytics(user.id),
    prisma.mistakeEntry.count({ where: filtersConditions }),
    prisma.mistakeEntry.findMany({
      where: filtersConditions,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {  // Only fetch needed fields
        id: true,
        topic: true,
        question: true,
        explanation: true,
        source: true,
        subject: true,
        difficulty: true,
        resolved: true,
        createdAt: true,
      },
    }),
    prisma.mistakeEntry.count({ 
      where: { userId: user.id, resolved: false } 
    }),
  ]);

  const serializedMistakes = rawMistakes.map((m) => ({
    ...m,
    topic: m.topic ?? "General",
    explanation: m.explanation ?? "",
    source: m.source ?? "",
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mistakes & Weak Areas
        </h1>
        <p className="text-slate-400 mt-2">Review and fix your recurring errors</p>
      </div>

      <MistakesContent
        analytics={analytics}
        pendingReviewCount={totalPendingCount}
        mistakes={serializedMistakes}
        totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
        currentPage={currentPage}
      />
    </div>
  );
}
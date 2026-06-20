import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { SUBJECT_MAP } from "@/config/subjects";
import { getMistakeAnalytics } from "@/lib/analytics/mistake-analytics";
import { MistakesContent } from "@/components/mistakes/MistakesContent";

const ITEMS_PER_PAGE = 20;

export default async function MistakesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedParams.page || 1));
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/login");

  const subjectParam = resolvedParams.subject;
  let mappedSubject: Prisma.MistakeEntryWhereInput["subject"] | undefined;

  if (subjectParam && subjectParam !== "All" && subjectParam in SUBJECT_MAP) {
    mappedSubject = SUBJECT_MAP[subjectParam as keyof typeof SUBJECT_MAP];
  }

  const filtersConditions: Prisma.MistakeEntryWhereInput = {
    userId: user.id,
    ...(mappedSubject && { subject: mappedSubject }),
    ...(resolvedParams.status && resolvedParams.status !== "All" && { resolved: resolvedParams.status === "RESOLVED" }),
    ...(resolvedParams.search && {
      OR: [
        { topic: { contains: resolvedParams.search, mode: "insensitive" } },
        { question: { contains: resolvedParams.search, mode: "insensitive" } },
      ],
    }),
  };

  const [analytics, totalCount, rawMistakes, totalPendingCount] = await Promise.all([
    getMistakeAnalytics(user.id),
    prisma.mistakeEntry.count({ where: filtersConditions }),
    prisma.mistakeEntry.findMany({
      where: filtersConditions,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.mistakeEntry.count({ where: { userId: user.id, resolved: false } }),
  ]);

  const serializedMistakes = rawMistakes.map((m) => ({
    ...m,
    topic: m.topic ?? "General",
    explanation: m.explanation ?? "",
    source: m.source ?? "",
  }));

  return (
    <MistakesContent
      analytics={analytics}
      pendingReviewCount={totalPendingCount}
      mistakes={serializedMistakes}
      totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
      currentPage={currentPage}
    />
  );
}
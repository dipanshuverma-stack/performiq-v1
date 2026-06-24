import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PracticeDashboard } from "@/components/practice/practice-dashboard";
import { PracticeSessionData } from "@/components/practice/core/session-types";

export default async function PracticePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const rawSessions = await prisma.practiceSession.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      subject: true,
      topic: true,
      durationSeconds: true,
      accuracy: true,
      createdAt: true,
      totalQuestions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentSessions: PracticeSessionData[] = rawSessions.map((s) => ({
    id: s.id,
    subject: s.subject,
    topic: s.topic,
    durationSeconds: s.durationSeconds ?? 0,
    accuracy: s.accuracy,
    createdAt: s.createdAt,
    attemptsCount: s.totalQuestions,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Practice</h1>
        <p className="text-slate-400 mt-2">Build speed and accuracy through focused sessions</p>
      </div>

      <PracticeDashboard recentSessions={recentSessions} />
    </div>
  );
}
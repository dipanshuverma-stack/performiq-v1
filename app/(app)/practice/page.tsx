import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PracticeDashboard } from "@/components/practice/practice-dashboard";
import { PracticeSessionData } from "@/components/practice/core/session-types";

export default async function PracticePage() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return null;
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

  // ✅ Clean, minimal, and fully type-safe allocation rendering
  return (
    <PracticeDashboard
      recentSessions={recentSessions}
    />
  );
}
// app/practice/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PracticeDashboard } from "@/components/practice/practice-dashboard";

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
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  /**
   * Strict Structural Mapping Matrix:
   * Explicitly shape our collection to match the component's contract.
   * This completely avoids type-narrowing bugs between Prisma objects and React interfaces.
   */
  const recentSessions = rawSessions.map((s) => ({
    id: s.id,
    subject: s.subject,
    topic: s.topic,
    accuracy: s.accuracy,
    createdAt: s.createdAt,
  }));

  return (
    <PracticeDashboard
      recentSessions={recentSessions}
    />
  );
}
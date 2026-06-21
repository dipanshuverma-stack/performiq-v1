import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { PageShell } from "@/components/ui/page-shell";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardFocusGrid } from "@/components/dashboard/dashboard-focus-grid";
import { DashboardStudyPlan } from "@/components/dashboard/dashboard-study-plan";

import { getDashboardIntelligence } from "@/lib/analytics/dashboard-intelligence";
import { BANKING_EXAMS } from "@/lib/exams";

function getDaysLeft(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true },
  });
  if (!user) redirect("/login");

  const dashboard = await getDashboardIntelligence(user.id);

  // Find the active exam to feed into the DashboardHero
  const activeExam = BANKING_EXAMS.find((e) => e.active) || BANKING_EXAMS[0];
  const daysLeft = getDaysLeft(activeExam.date);

  return (
    <PageShell>
      <DashboardHero
        userName={session.user.name ?? "Aspirant"}
        focusTopic={dashboard.nextFocusTopic}
        priorityTopicsCount={dashboard.priorities.length}
        revisionsDue={dashboard.revisionsDue}
        activeExam={activeExam.name}
        daysLeft={daysLeft}
      />

      <DashboardKPIGrid
        accuracy={dashboard.averageAccuracy}
        avgMockScore={dashboard.averageMockScore}
        revisionCompletion={dashboard.revisionCompletion}
        consistencyStreak={dashboard.currentStreak}
      />

      <DashboardFocusGrid priorities={dashboard.priorities} />

      <DashboardStudyPlan planItems={dashboard.studyPlan} />
    </PageShell>
  );
}
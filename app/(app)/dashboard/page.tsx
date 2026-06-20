import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { PageShell } from "@/components/ui/page-shell";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardFocusGrid } from "@/components/dashboard/dashboard-focus-grid";
import { DashboardStudyPlan } from "@/components/dashboard/dashboard-study-plan";

import { getDashboardIntelligence } from "@/lib/analytics/dashboard-intelligence";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getDashboardIntelligence(user.id);

  return (
    <PageShell>
      <DashboardHero
        userName={session.user.name ?? "Aspirant"}
        focusTopic={dashboard.nextFocusTopic}
        priorityTopicsCount={dashboard.priorities.length}
        revisionsDue={dashboard.revisionsDue}
        activeExam="SBI PO"
      />

      <DashboardKPIGrid
        accuracy={dashboard.averageAccuracy}
        avgMockScore={dashboard.averageMockScore}
        revisionCompletion={dashboard.revisionCompletion}
        consistencyStreak={dashboard.currentStreak}
      />

      <DashboardFocusGrid
        priorities={dashboard.priorities}
      />

      <DashboardStudyPlan
        planItems={dashboard.studyPlan}
      />
    </PageShell>
  );
}
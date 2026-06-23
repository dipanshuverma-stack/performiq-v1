import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { cache } from "react";

import { PageShell } from "@/components/ui/page-shell";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardFocusGrid } from "@/components/dashboard/dashboard-focus-grid";
import { DashboardStudyPlan } from "@/components/dashboard/dashboard-study-plan";
import { PrioritiesWidget } from "@/components/dashboard/PrioritiesWidget";
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner";

import { getDashboardIntelligence } from "@/lib/analytics/dashboard-intelligence";
import { BANKING_EXAMS } from "@/lib/exams";

const getDaysLeft = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const cachedDashboardIntelligence = cache(async (email: string) => {
  return getDashboardIntelligence(email);
});

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const email = session.user.email;

  // 1. Fetch User first
  const user = await prisma.user.findUnique({
    where: { email },
    select: { 
      id: true, 
      name: true, 
      plannerRows: true 
    },
  });

  if (!user) redirect("/login");

  // 2. Fetch other data in parallel
  const [dashboard, plannerTasks] = await Promise.all([
    cachedDashboardIntelligence(email),

    prisma.weeklyPlan.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        day: true,
        rowIndex: true,
        title: true,
        time: true,
        completed: true,
      },
      orderBy: [
        { day: "asc" },
        { rowIndex: "asc" },
      ],
    }),
  ]);

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

      <Suspense fallback={<div className="h-80 rounded-3xl bg-white/[0.03] animate-pulse" />}>
        <WeeklyPlanner 
          plannerTasks={plannerTasks} 
          initialRows={user.plannerRows ?? 5} 
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="h-96 rounded-2xl bg-white/[0.03] animate-pulse" />}>
            <DashboardFocusGrid priorities={dashboard.priorities} />
          </Suspense>
        </div>

        <div className="lg:col-span-5">
          <Suspense fallback={<div className="h-96 rounded-2xl bg-white/[0.03] animate-pulse" />}>
            <PrioritiesWidget userId={user.id} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="h-96 rounded-2xl bg-white/[0.03] animate-pulse" />}>
        <DashboardStudyPlan planItems={dashboard.studyPlan} />
      </Suspense>
    </PageShell>
  );
}
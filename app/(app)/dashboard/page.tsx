import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { cache } from "react";

import { PageShell } from "@/components/ui/page-shell";

import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardTodaysTasks } from "@/components/dashboard/dashboard-todays-tasks";

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

const cachedDashboardIntelligence = cache(async (email: string) => 
  getDashboardIntelligence(email)
);

const cachedTodayPlannerTasks = cache(async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return prisma.weeklyPlan.findMany({
    where: {
      userId,
      plannedDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      id: true,
      title: true,
      time: true,
      completed: true,
    },
    orderBy: {
      rowIndex: "asc",
    },
  });
});

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const email = session.user.email;

  // Parallel + Cached critical data
  const [dashboard, todayTasks] = await Promise.all([
    cachedDashboardIntelligence(email),
    cachedTodayPlannerTasks(session.user.id!),
  ]);

  const activeExam = BANKING_EXAMS.find((e) => e.active) || BANKING_EXAMS[0];
  const daysLeft = getDaysLeft(activeExam.date);

  return (
    <PageShell>
      {/* Critical content loads immediately */}
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

      {/* Today's Tasks */}
      <DashboardTodaysTasks tasks={todayTasks} />

      {/* Focus + Priorities Sections Currently Commented Out */}
    </PageShell>
  );
}
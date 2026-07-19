import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

import { PageShell } from "@/components/ui/page-shell";

import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardTodaysTasks } from "@/components/dashboard/dashboard-todays-tasks";

import { getDashboardIntelligence } from "@/lib/analytics/dashboard-intelligence";
import { BANKING_EXAMS } from "@/lib/exams";
import { rolloverWeeklyPlan } from "@/lib/planner/rollover-weekly-plan";
import { getPlannerToday } from "@/lib/planner/planner-date";

const getDaysLeft = (date: Date): number => {
  const today = getPlannerToday();
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const cachedDashboardIntelligence = cache(async (userId: string) => 
  getDashboardIntelligence(userId)
);

const cachedTodayPlannerTasks = cache(async (userId: string) => {
  const today = getPlannerToday();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return prisma.weeklyPlan.findMany({
    where: {
      userId,
      completed: false,
      OR: [
        {
          plannedDate: {
            gte: today,
            lt: tomorrow,
          },
        },
        {
          carryForward: true,
        },
      ],
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
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  await rolloverWeeklyPlan(userId);

  const [dashboard, todayTasks] = await Promise.all([
    cachedDashboardIntelligence(userId),
    cachedTodayPlannerTasks(userId),
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
        activeExam={activeExam.name}
        daysLeft={daysLeft}
        currentXP={dashboard.currentXP}
        consistencyGoal={dashboard.consistencyGoal}
        isConsistencyCompleted={dashboard.consistencyCompleted}
        isFullPowerCompleted={dashboard.fullPowerCompleted}
        nextAction={dashboard.nextAction}
      />

      {/* Actionable Today's Mission layout block */}
      <DashboardTodaysTasks tasks={todayTasks} />

      {/* Baseline performance snapshot */}
      <DashboardKPIGrid
        accuracy={dashboard.averageAccuracy}
        avgMockScore={dashboard.averageMockScore}
        consistencyStreak={dashboard.currentStreak}
      />
    </PageShell>
  );
}
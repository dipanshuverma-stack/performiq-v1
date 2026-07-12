import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache, Suspense } from "react";

// Components
import { PageShell } from "@/components/ui/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { TaskHero } from "@/components/tasks/TaskHero";
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner";

// Step 7: Import the rollover function
import { rolloverWeeklyPlan } from "@/lib/planner/rollover-weekly-plan";

// --- Data Fetching (Cached) ---

// Step 10: Updated to query by userId instead of email for optimal querying
const cachedGetUserTasks = cache(async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plannerRows: true,
    },
  })
);

const cachedWeeklyPlan = cache(async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setDate(end.getDate() + 30);

  return prisma.weeklyPlan.findMany({
    where: {
      userId,
      plannedDate: {
        gte: today,
        lt: end,
      },
    },
    select: {
      id: true,
      plannedDate: true,
      rowIndex: true,
      title: true,
      time: true,
      completed: true,
      carryForward: true,
      carryForwardDays: true, // ✅ Fixed: Fetching the missing counter field
    },
    orderBy: [
      { plannedDate: "asc" },
      { rowIndex: "asc" },
    ],
  });
});

const cachedTodayPlannerProgress = cache(async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const tasks = await prisma.weeklyPlan.findMany({
    where: {
      userId,
      plannedDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      completed: true,
    },
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    percentage,
  };
});

// --- Page Component ---

export default async function TasksPage() {
  // Step 8: Simplify auth check using userId
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  // Step 9: Run rollover task mutation before fetching updated data
  await rolloverWeeklyPlan(userId);

  // Step 10: Parallelized data fetching completely unified by userId
  const [userWithTasks, plannerTasks, todayProgress] = await Promise.all([
    cachedGetUserTasks(userId),
    cachedWeeklyPlan(userId),
    cachedTodayPlannerProgress(userId),
  ]);

  if (!userWithTasks) redirect("/login");

  // Temporary Verification Log
  console.log("Hydrating Planner with Tasks:", JSON.stringify(plannerTasks, null, 2));

  return (
    <PageShell>
      <PageContainer size="wide">
        <PageHeader
          title="Planner"
          description="Plan your preparation and track today's execution."
        />

        <TaskHero
          total={todayProgress.total}
          completed={todayProgress.completed}
          pending={todayProgress.pending}
          percentage={todayProgress.percentage}
        />

        <Suspense
          fallback={
            <div className="h-80 rounded-3xl bg-white/[0.03] animate-pulse my-6" />
          }
        >
          <WeeklyPlanner
            plannerTasks={plannerTasks}
            initialRows={userWithTasks.plannerRows ?? 5}
          />
        </Suspense>
      </PageContainer>
    </PageShell>
  );
}
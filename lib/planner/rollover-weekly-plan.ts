import { prisma } from "@/lib/prisma";

export async function rolloverWeeklyPlan(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Fetch exactly what needs to move. If empty, early exit saves DB write transaction costs.
  const tasks = await prisma.weeklyPlan.findMany({
    where: {
      userId,
      completed: false,
      plannedDate: {
        lt: today,
      },
    },
    select: {
      id: true,
      carryForwardDays: true,
    },
  });

  if (tasks.length === 0) return;

  // 2. Perform a transparent batch update using explicit increments for clean server debugging
  await prisma.$transaction(
    tasks.map((task) =>
      prisma.weeklyPlan.update({
        where: {
          id: task.id,
        },
        data: {
          plannedDate: today,
          carryForward: true,
          carryForwardDays: task.carryForwardDays + 1,
        },
      })
    )
  );
}
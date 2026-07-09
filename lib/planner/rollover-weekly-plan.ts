import { prisma } from "@/lib/prisma";

export async function rolloverWeeklyPlan(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find unfinished tasks scheduled for yesterday
  const tasks = await prisma.weeklyPlan.findMany({
    where: {
      userId,
      completed: false,
      plannedDate: {
        gte: yesterday,
        lt: today,
      },
    },
    select: {
      id: true,
    },
  });

  if (tasks.length === 0) return;

  await prisma.$transaction(
    tasks.map((task) =>
      prisma.weeklyPlan.update({
        where: {
          id: task.id,
        },
        data: {
          plannedDate: today,
          carryForward: true,
        },
      })
    )
  );
}
import { prisma } from "@/lib/prisma";

export async function rolloverWeeklyPlan(userId: string) {
  // --- Improvement 3: Establish Clear Date Boundaries ---
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // Day-of-week integers for your day tracking logic (0 = Mon, 6 = Sun)
  const todayDay = todayStart.getDay() === 0 ? 6 : todayStart.getDay() - 1;
  const yesterdayDay = todayDay === 0 ? 6 : todayDay - 1;

  // --- Improvement 2: Fetch unfinished tasks ONLY from yesterday's 24h window ---
  const unfinishedTasks = await prisma.weeklyPlan.findMany({
    where: {
      userId,
      day: yesterdayDay,
      completed: false,
      // Prevents week-old or older tasks from rolling over
      createdAt: {
        gte: yesterdayStart,
        lt: todayStart,
      },
    },
    orderBy: {
      rowIndex: "asc",
    },
  });

  if (unfinishedTasks.length === 0) return;

  // --- Idempotency Check ---
  const alreadyCarried = await prisma.weeklyPlan.findFirst({
    where: {
      userId,
      day: todayDay,
      carryForward: true,
      originalDay: yesterdayDay,
      createdAt: {
        gte: todayStart,
      },
    },
  });

  if (alreadyCarried) return;

  // --- Calculate Starting Row Index ---
  const todayTasks = await prisma.weeklyPlan.findMany({
    where: { userId, day: todayDay },
    select: { rowIndex: true },
  });

  const nextRow = todayTasks.length === 0 
    ? 0 
    : Math.max(...todayTasks.map((t) => t.rowIndex)) + 1;

  // --- Map New Rows ---
  const newRows = unfinishedTasks.map((task, index) => ({
    userId,
    day: todayDay,
    rowIndex: nextRow + index,
    title: task.title,
    time: task.time,
    category: task.category,
    completed: false,
    carryForward: true,
    originalDay: yesterdayDay,
  }));

  // --- Improvement 1: Target specifically copied IDs via Transaction ---
  const carriedIds = unfinishedTasks.map((t) => t.id);

  await prisma.$transaction([
    prisma.weeklyPlan.createMany({
      data: newRows,
    }),
    prisma.weeklyPlan.updateMany({
      where: {
        id: {
          in: carriedIds,
        },
      },
      data: {
        carryForward: true,
      },
    }),
  ]);
}
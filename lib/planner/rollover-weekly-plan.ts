import { prisma } from "@/lib/prisma";
import { getPlannerToday } from "./planner-date";

export async function rolloverWeeklyPlan(userId: string) {
  const today = getPlannerToday();

  await prisma.weeklyPlan.updateMany({
    where: {
      userId,
      completed: false,
      carryForward: false,
      plannedDate: {
        lt: today,
      },
    },
    data: {
      carryForward: true,
    },
  });
}
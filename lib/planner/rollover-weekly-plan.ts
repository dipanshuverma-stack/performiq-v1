import { prisma } from "@/lib/prisma";
import { getPlannerToday } from "./planner-date";

/**
 * Sweeps the database to find overdue, uncompleted planner tasks matching 
 * dates prior to the current 3 AM boundary standard, marking them for rollover.
 */
export async function rolloverWeeklyPlan(userId: string): Promise<number> {
  const today = getPlannerToday();

  const result = await prisma.weeklyPlan.updateMany({
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

  return result.count;
}
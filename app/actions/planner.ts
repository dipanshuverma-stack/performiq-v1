"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addReward } from "@/lib/rewards/reward-log";
import { REWARD_POINTS } from "@/lib/rewards/constants";
import { updateStreak } from "@/lib/rewards/streak";
import { evaluateAchievementEvent } from "@/lib/achievements/evaluator";
import { type UnlockResult } from "@/lib/achievements/unlock";
import { RewardAction, RewardType, RepeatType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { generatePlannerDates } from "@/lib/planner/generate-planner-dates";
import { parsePlannerDate } from "@/lib/planner/planner-date";

async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");
  return user.id;
}

export async function addWeeklyPlanTask(data: { 
  plannedDate: string; 
  rowIndex: number; 
  title: string; 
  time?: string;
  repeatType?: "NONE" | "DAILY" | "ALTERNATE" | "EVERY_THREE_DAYS" | "CUSTOM";
  repeatWeekdays?: string[];
  occurrences?: number;
}) {
  const userId = await getAuthenticatedUserId();

  const dates = generatePlannerDates({
    startDate: parsePlannerDate(data.plannedDate),
    repeatType: data.repeatType ?? "NONE",
    repeatWeekdays: data.repeatWeekdays ?? [],
    occurrences: data.occurrences,
  });

  if (dates.length === 0) return;

  // Optimized: Batched compilation via high-efficiency database bulk inserts
  await prisma.weeklyPlan.createMany({
    data: dates.map((date) => ({
      userId,
      plannedDate: date,
      rowIndex: data.rowIndex,
      title: data.title,
      time: data.time || null,
      repeatType: (data.repeatType as RepeatType) ?? "NONE",
      repeatWeekdays: data.repeatWeekdays ?? [],
      carryForward: false,
      carryForwardDays: 0,
    })),
  });

  revalidatePath("/tasks");
}

export async function deleteWeeklyPlanTask(id: string) {
  const userId = await getAuthenticatedUserId();

  await prisma.weeklyPlan.deleteMany({
    where: { id, userId },
  });

  revalidatePath("/tasks");
}

export async function updatePlannerRows(rows: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.user.update({ 
    where: { email: session.user.email }, 
    data: { plannerRows: rows } 
  });

  revalidatePath("/tasks");
}

export async function updateTaskPosition(data: { 
  id: string; 
  plannedDate: string; 
  rowIndex: number;
}) {
  const userId = await getAuthenticatedUserId();

  const task = await prisma.weeklyPlan.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!task || task.userId !== userId) throw new Error("Task not found");

  await prisma.weeklyPlan.update({
    where: {
      id: data.id,
    },
    data: {
      plannedDate: parsePlannerDate(data.plannedDate),
      rowIndex: data.rowIndex,
      carryForward: false,
      carryForwardDays: 0,
    },
  });

  revalidatePath("/tasks");
}

export async function toggleTaskCompletion(id: string) {
  const userId = await getAuthenticatedUserId();

  const task = await prisma.weeklyPlan.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      completed: true,
      userId: true,
    },
  });

  if (!task || task.userId !== userId) {
    throw new Error("Task not found");
  }

  const completed = !task.completed;

  await prisma.weeklyPlan.update({
    where: { id },
    data: {
      completed,
      ...(completed && {
        carryForward: false,
        carryForwardDays: 0,
      }),
    },
  });

  let unlockedAchievements: UnlockResult[] = [];

  if (completed) {
    // Fix 1: Execute core updates sequentially to eliminate lock contention on RewardSummary
    await addReward(
      userId,
      RewardType.PLANNER,
      RewardAction.EARN,
      REWARD_POINTS.PLANNER_TASK,
      "Planner Task Completed",
      task.title,
      task.id
    );

    await updateStreak(userId);

    // Step 4.1: Evaluate achievement events completely sequentially 
    const plannerAchievements = await evaluateAchievementEvent(
      userId,
      "planner_completed"
    );

    const rewardAchievements = await evaluateAchievementEvent(
      userId,
      "reward_updated"
    );

    const streakAchievements = await evaluateAchievementEvent(
      userId,
      "streak_updated"
    );

    // Step 4.2: Merge results elegantly
    unlockedAchievements = [
      ...plannerAchievements,
      ...rewardAchievements,
      ...streakAchievements,
    ];
  }

  // Dual synchronous revalidations kept clean to calculate dashboard progress correctly
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return {
    success: true,
    unlockedAchievements,
  };
}
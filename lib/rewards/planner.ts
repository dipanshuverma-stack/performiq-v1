"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { addReward } from "@/lib/rewards/reward-log";
import { REWARD_POINTS } from "@/lib/rewards/constants";
import { RewardAction, RewardType } from "@prisma/client";

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.id;
}

export async function addWeeklyPlanTask(data: {
  plannedDate: string;
  rowIndex: number;
  title: string;
  time?: string;
}) {
  const userId = await getAuthenticatedUserId();

  await prisma.weeklyPlan.create({
  data: {
    userId,
    plannedDate: new Date(data.plannedDate),
    rowIndex: data.rowIndex,
    title: data.title,
    time: data.time || null,
  },
});

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function deleteWeeklyPlanTask(id: string) {
  const userId = await getAuthenticatedUserId();

  await prisma.weeklyPlan.deleteMany({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function updatePlannerRows(rows: number) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      plannerRows: rows,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function updateTaskPosition(data: {
  id: string;
  plannedDate: number;
  rowIndex: number;
}) {
  const userId = await getAuthenticatedUserId();

  const task = await prisma.weeklyPlan.findUnique({
    where: {
      id: data.id,
    },
    select: {
      userId: true,
    },
  });

  if (!task || task.userId !== userId) {
    throw new Error("Task not found");
  }

  await prisma.weeklyPlan.update({
    where: {
      id: data.id,
    },
    data: {
      plannedDate: new Date(data.plannedDate),
      rowIndex: data.rowIndex,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function toggleTaskCompletion(id: string) {
  const userId = await getAuthenticatedUserId();

  const task = await prisma.weeklyPlan.findUnique({
    where: {
      id,
    },
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
    where: {
      id,
    },
    data: {
      completed,
    },
  });

  // Reward only when marking complete
  if (completed) {
    await addReward(
      userId,
      RewardType.PLANNER,
      RewardAction.EARN,
      REWARD_POINTS.PLANNER_TASK,
      "Planner Task Completed",
      task.title,
      task.id
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}
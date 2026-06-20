"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Helper to fetch user ID efficiently
 */
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

export async function createTask(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 1 || title.length > 120) {
    throw new Error("Invalid task title");
  }

  await prisma.task.create({
    data: {
      title,
      userId,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function toggleTask(taskId: string) {
  const userId = await getAuthenticatedUserId();

  // Use findUnique for primary key index efficiency
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { completed: true, userId: true },
  });

  if (!task || task.userId !== userId) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const userId = await getAuthenticatedUserId();

  // Explicit ownership check via findUnique
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { userId: true },
  });

  if (!task || task.userId !== userId) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
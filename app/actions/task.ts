"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  
  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  await prisma.task.create({
    data: {
      title: title.trim(),
      userId,
    },
  });

  revalidatePath("/tasks");
}

export async function toggleTask(taskId: string) {
  const userId = await getAuthenticatedUserId();

  // Verify ownership: Only allow toggling tasks that belong to the current user
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task not found or unauthorized");

  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });

  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const userId = await getAuthenticatedUserId();

  // Verify ownership before deletion
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task not found or unauthorized");

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/tasks");
}
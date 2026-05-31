"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title?.trim()) return;

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.task.create({
    data: {
      title,
      userId: user.id,
    },
  });

  revalidatePath("/tasks");
}

export async function toggleTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) return;

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      completed: !task.completed,
    },
  });

  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  revalidatePath("/tasks");
}
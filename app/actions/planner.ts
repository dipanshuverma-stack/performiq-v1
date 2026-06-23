"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWeeklyPlanTask(data: { 
  day: number; 
  rowIndex: number; 
  title: string; 
  time?: string 
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email }, 
    select: { id: true } 
  });
  if (!user) throw new Error("User not found");

  await prisma.weeklyPlan.create({
    data: { 
      userId: user.id, 
      day: data.day, 
      rowIndex: data.rowIndex, 
      title: data.title, 
      time: data.time || null,
    },
  });
  revalidatePath("/dashboard");
}

export async function deleteWeeklyPlanTask(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  await prisma.weeklyPlan.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard");
}

export async function updatePlannerRows(rows: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  await prisma.user.update({ 
    where: { email: session.user.email }, 
    data: { plannerRows: rows } 
  });
  revalidatePath("/dashboard");
}

export async function updateTaskPosition(data: { id: string; day: number; rowIndex: number }) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  await prisma.weeklyPlan.updateMany({
    where: { id: data.id, userId: user.id },
    data: { day: data.day, rowIndex: data.rowIndex },
  });
  revalidatePath("/dashboard");
}

export async function toggleTaskCompletion(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const task = await prisma.weeklyPlan.findUnique({
    where: { id, userId: user.id },
    select: { completed: true },
  });

  if (!task) throw new Error("Task not found");

  await prisma.weeklyPlan.updateMany({
    where: { id, userId: user.id },
    data: { completed: !task.completed },
  });
  revalidatePath("/dashboard");
}
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTask(
  taskId: string,
  completed: boolean
) {
  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      completed: !completed,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
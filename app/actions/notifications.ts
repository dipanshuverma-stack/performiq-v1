"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(
  notificationId: string
) {
  await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
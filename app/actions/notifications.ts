"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Security: Ensure the notification belongs to the user
  await prisma.notification.update({
    where: {
      id: notificationId,
      userId: user.id,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
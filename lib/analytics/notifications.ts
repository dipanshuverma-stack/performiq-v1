import { cache } from "react";
import { prisma } from "@/lib/prisma";

const cachedGetUnreadNotificationCount = cache(async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
});

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return cachedGetUnreadNotificationCount(userId);
}
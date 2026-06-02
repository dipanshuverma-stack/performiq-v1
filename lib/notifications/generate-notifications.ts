import { prisma } from "@/lib/prisma";

export async function generateNotifications(
  userId: string
) {
  const revisionsDue =
    await prisma.revision.count({
      where: {
        userId,
        nextRevision: {
          lte: new Date(),
        },
      },
    });

  if (revisionsDue === 0) {
    return;
  }

  const existing =
    await prisma.notification.findFirst({
      where: {
        userId,
        title: "Revision Due",
        read: false,
      },
    });

  if (existing) {
    return;
  }

  await prisma.notification.create({
    data: {
      userId,
      title: "Revision Due",
      message: `${revisionsDue} revisions are due today.`,
    },
  });
}
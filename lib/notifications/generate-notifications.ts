import { prisma } from "@/lib/prisma";

export async function generateNotifications(userId: string) {
  await Promise.all([
    generateRevisionNotifications(userId),
    generateMockNotifications(userId),
    generateAccuracyNotifications(userId),
  ]);
}

async function generateRevisionNotifications(userId: string) {
  const revisionsDue = await prisma.revision.count({
    where: {
      userId,
      nextRevision: { lte: new Date() },
    },
  });

  if (revisionsDue < 3) return;

  const message = `${revisionsDue} revisions are due today.`;

  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Revision Due",
      read: false,
    },
  });

  if (existing) {
    if (existing.message !== message) {
      await prisma.notification.update({
        where: { id: existing.id },
        data: { message },
      });
    }
    return;
  }

  await prisma.notification.create({
    data: {
      userId,
      title: "Revision Due",
      message,
    },
  });
}

async function generateMockNotifications(userId: string) {
  const mocks = await prisma.mockTest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { id: true, score: true },
  });

  if (mocks.length < 2) return;

  const latest = mocks[0];
  const previousBest = await prisma.mockTest.aggregate({
    where: {
      userId,
      id: { not: latest.id },
    },
    _max: { score: true },
  });

  if (latest.score <= (previousBest._max.score ?? 0)) return;

  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Personal Best",
      read: false,
    },
  });

  if (existing) return;

  await prisma.notification.create({
    data: {
      userId,
      title: "Personal Best",
      message: `New highest mock score: ${latest.score}`,
    },
  });
}

async function generateAccuracyNotifications(userId: string) {
  const latest = await prisma.mockTest.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { accuracy: true },
  });

  if (!latest) return;

  if (latest.accuracy >= 70) {
    await prisma.notification.deleteMany({
      where: {
        userId,
        title: "Accuracy Alert",
        read: false,
      },
    });
    return;
  }

  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Accuracy Alert",
      read: false,
    },
  });

  if (existing) return;

  await prisma.notification.create({
    data: {
      userId,
      title: "Accuracy Alert",
      message: `Accuracy dropped to ${latest.accuracy.toFixed(1)}%. Focus on precision before increasing speed.`,
    },
  });
}
import { prisma } from "@/lib/prisma";

export async function generateNotifications(
  userId: string
) {
  await Promise.all([
    generateRevisionNotifications(userId),
    generateMockNotifications(userId),
    generateAccuracyNotifications(userId),
  ]);
}

async function generateRevisionNotifications(
  userId: string
) {
  const revisionsDue = await prisma.revision.count({
    where: {
      userId,
      nextRevision: {
        lte: new Date(),
      },
    },
  });

  if (revisionsDue < 3) {
    return;
  }

  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Revision Due",
      read: false,
    },
  });

  const message = `${revisionsDue} revisions are due today.`;

  if (existing) {
    if (existing.message !== message) {
      await prisma.notification.update({
        where: {
          id: existing.id,
        },
        data: {
          message,
        },
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

async function generateMockNotifications(
  userId: string
) {
  const mocks = await prisma.mockTest.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
  });

  if (mocks.length < 2) {
    return;
  }

  const latest = mocks[0];

  const bestPrevious =
    await prisma.mockTest.aggregate({
      where: {
        userId,
        id: {
          not: latest.id,
        },
      },
      _max: {
        score: true,
      },
    });

  const previousBest =
    bestPrevious._max.score ?? 0;

  if (latest.score <= previousBest) {
    return;
  }

  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Personal Best",
      read: false,
    },
  });

  if (existing) {
    return;
  }

  await prisma.notification.create({
    data: {
      userId,
      title: "Personal Best",
      message: `New highest mock score: ${latest.score}`,
    },
  });
}

async function generateAccuracyNotifications(
  userId: string
) {
  const latest = await prisma.mockTest.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latest) {
    return;
  }

  // 👇 SWAPPED: Accuracy recovered → remove old unread warning messages automatically
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

  if (existing) {
    return;
  }

  await prisma.notification.create({
    data: {
      userId,
      title: "Accuracy Alert",
      message: `Accuracy dropped to ${latest.accuracy.toFixed(1)}%. Focus on precision before increasing speed.`,
    },
  });
}
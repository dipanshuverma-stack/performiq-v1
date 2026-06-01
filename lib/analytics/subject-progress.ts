import { prisma } from "@/lib/prisma";

export async function getSubjectProgress(
  userId: string
) {
  const topics =
    await prisma.topicProgress.findMany({
      where: {
        userId,
      },
    });

  const grouped = topics.reduce(
    (acc, topic) => {
      if (!acc[topic.subject]) {
        acc[topic.subject] = {
          total: 0,
          completed: 0,
        };
      }

      acc[topic.subject].total++;

      if (topic.completed) {
        acc[topic.subject].completed++;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        completed: number;
      }
    >
  );

  return Object.entries(grouped).map(
    ([subject, data]) => ({
      subject,
      total: data.total,
      completed: data.completed,
      percentage:
        data.total > 0
          ? Math.round(
              (data.completed /
                data.total) *
                100
            )
          : 0,
    })
  );
}
import { prisma } from "@/lib/prisma";

export async function getMistakeAnalytics(
  userId: string
) {
  const mistakes =
    await prisma.mistakeEntry.findMany({
      where: {
        userId,
      },
    });

  const totalMistakes =
    mistakes.length;

  const resolved =
    mistakes.filter(
      (m) => m.resolved
    ).length;

  const pending =
    totalMistakes - resolved;

  const resolutionRate =
    totalMistakes > 0
      ? (
          (resolved /
            totalMistakes) *
          100
        ).toFixed(1)
      : "0";

  const subjectBreakdown =
    mistakes.reduce(
      (acc, mistake) => {
        acc[mistake.subject] =
          (acc[mistake.subject] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>
    );

  const topWeakSubject =
    Object.entries(subjectBreakdown)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "-";

  return {
    totalMistakes,
    resolved,
    pending,
    resolutionRate,
    topWeakSubject,
    subjectBreakdown,
  };
}
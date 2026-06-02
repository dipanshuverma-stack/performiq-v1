import { getPracticeAnalytics } from "./practice-analytics";

export async function getPerformanceScore(
  userId: string
) {
  const practice =
    await getPracticeAnalytics(
      userId
    );

  const score = Math.round(
    practice.averageAccuracy * 0.7 +
      practice.speedScore * 0.3
  );

  return {
    score,

    accuracy:
      practice.averageAccuracy,

    speedScore:
      practice.speedScore,
  };
}
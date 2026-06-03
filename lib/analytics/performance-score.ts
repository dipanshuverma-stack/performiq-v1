import { cache } from 'react';
import { getPracticeAnalytics } from "./practice-analytics";

// Use 'cache' from 'react' to memoize the result for the duration of the request.
// This solves your performance bottleneck without security risks.
export const getPerformanceScore = cache(async (userId: string) => {
  const practice = await getPracticeAnalytics(userId);

  const score = Math.round(
    practice.averageAccuracy * 0.7 + practice.speedScore * 0.3
  );

  return {
    score,
    accuracy: practice.averageAccuracy,
    speedScore: practice.speedScore,
  };
});
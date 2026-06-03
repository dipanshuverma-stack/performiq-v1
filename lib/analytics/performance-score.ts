import { cache } from 'react';
import { unstable_cache } from "next/cache";
import { getPracticeAnalytics } from "./practice-analytics";

// 💡 Wrap everything in an outer function so 'userId' is available to both cache engines
export const getPerformanceScore = (userId: string) =>
  unstable_cache(
    // 1. React 'cache' memoizes this execution for the duration of a single request
    cache(async () => {
      const practice = await getPracticeAnalytics(userId);

      const score = Math.round(
        practice.averageAccuracy * 0.7 + practice.speedScore * 0.3
      );

      return {
        score,
        accuracy: practice.averageAccuracy,
        speedScore: practice.speedScore,
      };
    }),
    ["performance-score", userId], // ✅ FIXED: 'userId' is now perfectly in scope here!
    {
      revalidate: 3600, // Cache results globally for 1 hour
      tags: ["performance"],
    }
  )(); // 💡 CRITICAL: Invokes the execution chain immediately
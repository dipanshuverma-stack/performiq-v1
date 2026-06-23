import type { DashboardIntelligence } from "./dashboard-intelligence";

/**
 * Evaluates compiled dashboard analytical markers to output custom tactical notices.
 * ✅ Pure Function: Fast, lightweight, no side effects.
 */
export function getDashboardInsight(intelligence: DashboardIntelligence) {
  // Prioritized checks (most critical first for early return)
  if (intelligence.readiness?.readiness < 70) {
    return {
      type: "warning" as const,
      title: "Focus on Readiness",
      message:
        "Complete more syllabus topics and revision sessions to improve your readiness score.",
    };
  }

  if (intelligence.speedScore < 70) {
    return {
      type: "speed" as const,
      title: "Increase Your Speed",
      message:
        "Your question-solving speed is below the target. Practice timed sessions regularly.",
    };
  }

  if (intelligence.currentStreak === 0) {
    return {
      type: "streak" as const,
      title: "Restart Your Streak",
      message:
        "You don't have an active practice streak. Complete a session today.",
    };
  }

  if (intelligence.priorities?.length > 0) {
    return {
      type: "revision" as const,
      title: "Priority Revision",
      message: `Prioritize "${intelligence.priorities[0].topic}" for revision today.`,
    };
  }

  return {
    type: "success" as const,
    title: "Great Progress",
    message:
      "Your preparation is on track. Maintain consistency and continue practicing.",
  };
}
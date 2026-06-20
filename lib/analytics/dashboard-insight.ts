import type { DashboardIntelligence } from "./dashboard-intelligence";

/**
 * Evaluates compiled dashboard analytical markers to output custom tactical notices.
 * ✅ Pure Function: Accepts prepared state directly, avoiding redundant database round-trips.
 */
export function getDashboardInsight(intelligence: DashboardIntelligence) {
  if (intelligence.readiness.readiness < 70) {
    return {
      type: "warning",
      title: "Focus on Readiness",
      message:
        "Complete more syllabus topics and revision sessions to improve your readiness score.",
    };
  }

  if (intelligence.speedScore < 70) {
    return {
      type: "speed",
      title: "Increase Your Speed",
      message:
        "Your question-solving speed is below the target. Practice timed sessions regularly.",
    };
  }

  if (intelligence.currentStreak === 0) {
    return {
      type: "streak",
      title: "Restart Your Streak",
      message:
        "You don't have an active practice streak. Complete a session today.",
    };
  }

  if (intelligence.priorities.length > 0) {
    return {
      type: "revision",
      title: "Priority Revision",
      message: `Prioritize "${intelligence.priorities[0].topic}" for revision today.`,
    };
  }

  return {
    type: "success",
    title: "Great Progress",
    message:
      "Your preparation is on track. Maintain consistency and continue practicing.",
  };
}
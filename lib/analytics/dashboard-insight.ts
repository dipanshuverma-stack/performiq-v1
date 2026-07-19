import type { DashboardIntelligence } from "./dashboard-intelligence";

/**
 * Generates contextual tactical insight for the dashboard.
 * Pure, fast, and safe with structural nesting checks.
 */
export function getDashboardInsight(intelligence: DashboardIntelligence) {
  // 1. Primary overall preparation check
  if ((intelligence.readiness?.readiness ?? 100) < 70) {
    return {
      type: "warning" as const,
      title: "Focus on Readiness",
      message: "Complete more syllabus topics and revision sessions to improve your readiness score.",
    };
  }

  // 2. Secondary structural pacing metrics evaluation
  if ((intelligence.readiness?.speedScore ?? 100) < 70) {
    return {
      type: "speed" as const,
      title: "Increase Your Speed",
      message: "Your question-solving speed is below the target. Practice timed sessions regularly.",
    };
  }

  // 3. Consistency tracking
  if (intelligence.currentStreak === 0) {
    return {
      type: "streak" as const,
      title: "Restart Your Streak",
      message: "You don't have an active practice streak. Complete a session today.",
    };
  }

  // 4. Targeted topic adjustments
  if (intelligence.priorities && intelligence.priorities.length > 0) {
    return {
      type: "revision" as const,
      title: "Priority Revision",
      message: `Prioritize "${intelligence.priorities[0].topic}" for revision today.`,
    };
  }

  // Default optimal status match
  return {
    type: "success" as const,
    title: "Great Progress",
    message: "Your preparation is on track. Maintain consistency and continue practicing.",
  };
}
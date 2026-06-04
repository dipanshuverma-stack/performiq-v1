import { PageShell } from "@/components/ui/page-shell";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKPIGrid } from "@/components/dashboard/dashboard-kpi-grid";
import { DashboardFocusGrid } from "@/components/dashboard/dashboard-focus-grid";
import { DashboardInsights } from "@/components/dashboard/dashboard-insights";
import { DashboardStudyPlan } from "@/components/dashboard/dashboard-study-plan";

// Server-side data simulation deck
async function getDashboardData() {
  return {
    hero: { userName: "Dipanshu", focusTopic: "Simplification", priorityTopicsCount: 2, revisionsDue: 0 },
    metrics: { accuracy: 84.2, avgMockScore: 72, revisionCompletion: 96.8, consistencyStreak: 14 },
    priorities: [
      { topic: "Simplification & Approximation", mastery: 80, focusScore: 45 },
      { topic: "Data Interpretation (Pie Charts)", mastery: 65, focusScore: 78 },
      { topic: "Syllogism Matrix", mastery: 88, focusScore: 32 },
    ],
    insights: { strongestTopic: "Simplification", weakestTopic: "Reasoning (Puzzles)", nextFocus: "Puzzle Practice", revisionsCount: 0 },
    studyPlan: [
      { subject: "Quantitative Aptitude", topic: "Quadratic Equations High Level", duration: "45 mins" },
      { subject: "Reasoning Ability", topic: "Linear Seating Arrangement", duration: "60 mins" },
      { subject: "English Language", topic: "Reading Comprehension (Economy)", duration: "30 mins" },
    ],
  };
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <PageShell>
      {/* 
        Completely Cleaned: The isolated card wrapper container is gone.
        Child components blend perfectly with the global layout canvas background.
      */}
      <DashboardHero {...dashboardData.hero} />
      <DashboardKPIGrid {...dashboardData.metrics} />
      <DashboardFocusGrid priorities={dashboardData.priorities} />
      <DashboardInsights {...dashboardData.insights} />
      <DashboardStudyPlan planItems={dashboardData.studyPlan} />
    </PageShell>
  );
}
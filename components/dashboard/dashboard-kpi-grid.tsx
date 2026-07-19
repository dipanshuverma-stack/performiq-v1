import React from "react";
import { Activity, Flame, Award } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";

interface DashboardKPIGridProps {
  accuracy: number;
  avgMockScore: number;
  consistencyStreak: number;
}

export const DashboardKPIGrid = React.memo(function DashboardKPIGrid({
  accuracy,
  avgMockScore,
  consistencyStreak,
}: DashboardKPIGridProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Your Performance" />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Step 15.6 — Upgraded Accuracy Stat Card */}
        <StatCard
          title="Accuracy"
          value={`${Math.round(accuracy)}%`}
          label="Overall Practice Accuracy"
          status={
            accuracy >= 85
              ? "Excellent"
              : accuracy >= 70
              ? "Good Progress"
              : "Needs Improvement"
          }
          statusColor={
            accuracy >= 85
              ? "bg-emerald-500"
              : accuracy >= 70
              ? "bg-amber-500"
              : "bg-red-500"
          }
          icon={Activity}
          iconColor="text-indigo-400"
        />

        {/* Step 15.6 — Upgraded Mock Score Stat Card */}
        <StatCard
          title="Mock Score"
          value={Math.round(avgMockScore)}
          label="Average Mock Score"
          status={
            avgMockScore >= 80
              ? "Strong Performance"
              : avgMockScore >= 60
              ? "Building Momentum"
              : "More Practice Needed"
          }
          statusColor={
            avgMockScore >= 80
              ? "bg-emerald-500"
              : avgMockScore >= 60
              ? "bg-amber-500"
              : "bg-red-500"
          }
          icon={Award}
          iconColor="text-amber-400"
        />

        {/* Step 15.6 — Upgraded Study Streak Stat Card */}
        <StatCard
          title="Consistency"
          value={`🔥 ${consistencyStreak} Days`}
          label="Study Streak"
          status={
            consistencyStreak >= 30
              ? "Exceptional Consistency"
              : consistencyStreak >= 7
              ? "Keep The Chain Alive"
              : "Build Your Habit"
          }
          statusColor={
            consistencyStreak >= 30
              ? "bg-emerald-500"
              : consistencyStreak >= 7
              ? "bg-amber-500"
              : "bg-red-500"
          }
          icon={Flame}
          iconColor="text-orange-400"
        />
      </div>
    </section>
  );
});
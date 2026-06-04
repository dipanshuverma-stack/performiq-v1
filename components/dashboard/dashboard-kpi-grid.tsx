import { Target, Trophy, RotateCcw, Flame } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";

interface DashboardKPIGridProps {
  accuracy: number;
  avgMockScore: number;
  revisionCompletion: number;
  consistencyStreak: number;
}

export function DashboardKPIGrid({
  accuracy,
  avgMockScore,
  revisionCompletion,
  consistencyStreak,
}: DashboardKPIGridProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="Performance Snapshot" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          label="Top KPI"
          icon={Target}
          iconColor="text-indigo-400"
        />

        <StatCard
          title="Mock Score"
          value={avgMockScore}
          label="Average"
          icon={Trophy}
          iconColor="text-amber-400"
        />

        <StatCard
          title="Revision Completion"
          value={`${revisionCompletion}%`}
          label="This Week"
          icon={RotateCcw}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Consistency"
          value={`${consistencyStreak}d`}
          label="Current"
          icon={Flame}
          iconColor="text-orange-400"
        />
      </div>
    </section>
  );
}
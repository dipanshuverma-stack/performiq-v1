import { Trophy } from "lucide-react";

export default function AchievementsHeader() {
  return (
    <section className="flex items-end justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          ACHIEVEMENTS
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Achievement Gallery
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Unlock milestones as you complete planner tasks, practice sessions,
          mock tests, maintain study streaks, and earn reward points throughout
          your PerformIQ journey.
        </p>
      </div>

      <div
        className="
          hidden
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-amber-500/20
          bg-amber-500/10
          lg:flex
        "
      >
        <Trophy className="h-8 w-8 text-amber-400" />
      </div>
    </section>
  );
}
import Link from "next/link";
import { Flame } from "lucide-react";

type StreakCardProps = {
  streak: {
    currentStreak: number;
    longestStreak: number;
  };
};

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Link
      href="/dashboard"
      className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-amber-500/30 transition-all group flex flex-col justify-between h-full"
    >
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-7 w-7 text-amber-500" />
          <h3 className="font-semibold text-lg group-hover:text-amber-400 transition-colors">
            Study Streak
          </h3>
        </div>

        <div className="mt-4 space-y-1">
          <p className="font-bold text-white text-xl">
            {streak.currentStreak} {streak.currentStreak === 1 ? "Day" : "Days"} Current
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Best: {streak.longestStreak} {streak.longestStreak === 1 ? "Day" : "Days"}
          </p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-amber-400 transition-colors">
          View Progress →
        </span>
      </div>
    </Link>
  );
}
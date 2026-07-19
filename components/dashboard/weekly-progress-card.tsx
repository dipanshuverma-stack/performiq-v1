interface WeeklyProgressCardProps {
  completedDays: number;
  targetDays: number;
}

export default function WeeklyProgressCard({
  completedDays,
  targetDays,
}: WeeklyProgressCardProps) {
  const progress =
    (completedDays / targetDays) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0E121B] p-8">

      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        WEEKLY PROGRESS
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {completedDays} / {targetDays} Days
      </h2>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-5 flex justify-between">

        <div>
          <p className="text-xs text-muted-foreground">
            Weekly Reward
          </p>

          <p className="mt-1 text-xl font-semibold text-emerald-400">
            ₹350
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Remaining
          </p>

          <p className="mt-1 text-xl font-semibold">
            {targetDays - completedDays} Days
          </p>
        </div>

      </div>

    </div>
  );
}
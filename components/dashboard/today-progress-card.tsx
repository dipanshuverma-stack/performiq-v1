interface TodayProgressCardProps {
  dailyXP: number;
  targetXP: number;
}

export default function TodayProgressCard({
  dailyXP,
  targetXP,
}: TodayProgressCardProps) {
  const progress = Math.min(
    100,
    Math.round((dailyXP / targetXP) * 100)
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0E121B] p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        TODAY'S PROGRESS
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {dailyXP} / {targetXP} XP
      </h2>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {targetXP - dailyXP > 0
            ? `${targetXP - dailyXP} XP remaining`
            : "Daily goal achieved 🎉"}
        </p>

        <p className="font-semibold text-emerald-400">
          ₹50
        </p>
      </div>
    </div>
  );
}
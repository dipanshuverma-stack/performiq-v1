interface TodayFocusCardProps {
  currentXP: number;
  consistencyGoal: number;
  fullPowerGoal: number;
  consistencyReward: number;
  fullPowerReward: number;
}

export default function TodayFocusCard({
  currentXP,
  consistencyGoal,
  fullPowerGoal,
  consistencyReward,
  fullPowerReward,
}: TodayFocusCardProps) {
  const consistencyProgress = Math.min(
    100,
    Math.round((currentXP / consistencyGoal) * 100)
  );
  
  const fullPowerProgress = Math.min(
    100,
    Math.round((currentXP / fullPowerGoal) * 100)
  );

  const status =
    currentXP >= fullPowerGoal
      ? {
          title: "Full Power Completed 🚀",
          message: "Excellent work! Today's rewards are fully unlocked.",
          color: "text-emerald-400",
        }
      : currentXP >= consistencyGoal
      ? {
          title: "Daily Goal Completed ✅",
          message: `Only ${fullPowerGoal - currentXP} XP left to unlock the ₹${fullPowerReward} reward.`,
          color: "text-blue-400",
        }
      : {
          title: "Keep Going",
          message: `Earn ${consistencyGoal - currentXP} more XP to unlock ₹${consistencyReward}.`,
          color: "text-amber-400",
        };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0E121B] p-8">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          TODAY'S FOCUS
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Build Today's Momentum
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete your consistency goal first, then push for Full Power.
        </p>
      </div>

      {/* Progress */}
      <div className="mt-8 space-y-6">
        {/* Consistency Goal */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Daily Consistency
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Reward ₹{consistencyReward}
              </p>
            </div>
            {currentXP >= consistencyGoal ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                Claimed ✓
              </span>
            ) : (
              <span className="text-sm font-semibold text-emerald-400">
                ₹{consistencyReward}
              </span>
            )}
          </div>

          <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${consistencyProgress}%`,
              }}
            />
            <div className="absolute right-0 top-0 h-full w-px bg-white/30" />
          </div>
          
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{currentXP} XP</span>
            <span>{consistencyGoal} XP</span>
          </div>
        </div>

        {/* Full Power Goal */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Full Power Challenge
              </p>
              <p className="mt-1 text-xs text-blue-400">
                Reward ₹{fullPowerReward}
              </p>
            </div>
            {currentXP >= fullPowerGoal ? (
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                Reward Earned ✓
              </span>
            ) : (
              <span className="text-sm font-semibold text-blue-400">
                ₹{fullPowerReward}
              </span>
            )}
          </div>

          <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${fullPowerProgress}%`,
              }}
            />
            <div className="absolute right-0 top-0 h-full w-px bg-white/30" />
          </div>
          
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{currentXP} XP</span>
            <span>{fullPowerGoal} XP</span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-semibold ${status.color}`}>
              {status.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {status.message}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Today's XP
            </p>
            <p className="text-2xl font-bold">
              {currentXP}
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
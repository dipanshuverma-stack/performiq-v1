import {
  Trophy,
  Lock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface AchievementOverviewProps {
  stats: {
    total: number;
    unlocked: number;
    locked: number;
    completion: number;
  };
}

export default function AchievementOverview({
  stats,
}: AchievementOverviewProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Unlocked",
      value: stats.unlocked,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Locked",
      value: stats.locked,
      icon: Lock,
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
    },
    {
      title: "Completion",
      value: `${stats.completion}%`,
      icon: TrendingUp,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.06]
              bg-[#0E121B]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <div
              className={`
                flex h-12 w-12 items-center justify-center rounded-2xl
                ${card.bg}
                ${card.border}
                border
              `}
            >
              <Icon className={`h-6 w-6 ${card.color}`} />
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        );
      })}
    </section>
  );
}
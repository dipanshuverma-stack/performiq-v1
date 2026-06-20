"use client";

import {
  Trophy,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";

interface MockStatsGridProps {
  stats: {
    targetAccuracy: number;
    confidenceScore: number;
    prelimsMocks: number;
    mainsMocks: number;
  };
}

export default function MockStatsGrid({
  stats,
}: MockStatsGridProps) {
  const cards = [
    {
      title: "Target Accuracy",
      value: `${stats.targetAccuracy}%`,
      icon: Target,
      color: "text-cyan-400",
    },
    {
      title: "Confidence",
      value: stats.confidenceScore,
      icon: Brain,
      color: "text-violet-400",
    },
    {
      title: "Prelims",
      value: stats.prelimsMocks,
      icon: Trophy,
      color: "text-emerald-400",
    },
    {
      title: "Mains",
      value: stats.mainsMocks,
      icon: BarChart3,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              rounded-3xl
              border border-white/[0.08]
              bg-[#0E121B]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-500/30
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {card.title}
                </p>

                <h2 className={`mt-3 text-4xl font-black ${card.color}`}>
                  {card.value}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03]">
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
"use client";

import React from "react";
import { Brain, CircleCheckBig, Clock3, Hash } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface PracticeStatsGridProps {
  totalSessions: number;
  totalQuestions: number;
  averageAccuracy: number;
  totalPracticeHours: number;
}

export function PracticeStatsGrid({
  totalSessions,
  totalQuestions,
  averageAccuracy,
  totalPracticeHours,
}: PracticeStatsGridProps) {
  const stats = [
    {
      title: "Practice Sessions",
      value: totalSessions,
      label: "completed",
      icon: Brain,
      color: "text-slate-400",
    },
    {
      title: "Questions Solved",
      value: totalQuestions,
      label: "attempted",
      icon: Hash,
      color: "text-emerald-400",
    },
    {
      title: "Average Accuracy",
      value: `${averageAccuracy}%`,
      label: "overall",
      icon: CircleCheckBig,
      color: "text-violet-400",
    },
    {
      title: "Practice Time",
      value: `${totalPracticeHours}h`,
      label: "hours",
      icon: Clock3,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <GlassCard
          key={index}
          className="
            p-6
            group
            hover:-translate-y-1
            hover:border-white/[0.12]
            hover:bg-white/[0.04]
            transition-all
            duration-300
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                  font-semibold
                "
              >
                {stat.title}
              </p>
              <p className="mt-4 text-4xl font-black tracking-tight text-white tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>

            {/* Premium Icon Container */}
            <div
              className="
                h-11
                w-11
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.03]
                flex
                items-center
                justify-center
                text-slate-400
                group-hover:text-primary
                transition-colors
                flex-shrink-0
              "
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
"use client";

import { Trophy, Star } from "lucide-react";

import { ACHIEVEMENT_ICONS } from "@/lib/achievements/icons";
import type { UnlockResult } from "@/lib/achievements/unlock";
import type { AchievementIconKey } from "@/lib/achievements/icons";

type QueueItem = NonNullable<UnlockResult>;

interface AchievementToastProps {
  achievement: QueueItem["achievement"];
}

export default function AchievementToast({
  achievement,
}: AchievementToastProps) {
  const Icon =
    ACHIEVEMENT_ICONS[
      achievement.icon as AchievementIconKey
    ];

  return (
    <div
      className="
        w-[380px]
        rounded-3xl
        border
        border-amber-500/20
        bg-[#0E121B]
        p-5
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-amber-500/10
          "
        >
          <Icon className="h-7 w-7 text-amber-400" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Achievement Unlocked
          </p>

          <h3 className="mt-1 text-lg font-bold">
            {achievement.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {achievement.description}
          </p>

          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-amber-400" />
              +{achievement.rewardPoints}
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-cyan-400" />
              +{achievement.xp} XP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
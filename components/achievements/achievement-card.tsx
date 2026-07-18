import {
  Lock,
  Calendar,
  Star,
  Trophy,
} from "lucide-react";

import { ACHIEVEMENT_ICONS, type AchievementIconKey } from "@/lib/achievements/icons";
import { Achievement, AchievementRarity, UserAchievement } from "@prisma/client";

// Defines relation schema mapping directly from Prisma's generated type definitions
type AchievementWithUnlock = Achievement & {
  users: Pick<UserAchievement, "unlockedAt">[];
};

interface AchievementCardProps {
  achievement: AchievementWithUnlock;
}

const rarityStyles = {
  COMMON: {
    border: "border-slate-500/20",
    glow: "from-slate-400/10",
    badge: "bg-slate-500/10 text-slate-300",
  },
  RARE: {
    border: "border-blue-500/20",
    glow: "from-blue-500/10",
    badge: "bg-blue-500/10 text-blue-300",
  },
  EPIC: {
    border: "border-purple-500/20",
    glow: "from-purple-500/10",
    badge: "bg-purple-500/10 text-purple-300",
  },
  LEGENDARY: {
    border: "border-amber-500/30",
    glow: "from-amber-500/15",
    badge: "bg-amber-500/10 text-amber-300",
  },
} satisfies Record<
  AchievementRarity,
  {
    border: string;
    glow: string;
    badge: string;
  }
>;

export default function AchievementCard({
  achievement,
}: AchievementCardProps) {
  const unlocked = achievement.users.length > 0;

  const unlockedAt = unlocked
    ? new Date(
        achievement.users[0].unlockedAt
      ).toLocaleDateString("en-IN")
    : null;

  // Safe type conversion backed by the idempotent database seeder layer
  const Icon = ACHIEVEMENT_ICONS[achievement.icon as AchievementIconKey];

  const rarity = rarityStyles[achievement.rarity];

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-[#0E121B]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        ${rarity.border}
        ${
          unlocked
            ? ""
            : "opacity-70 grayscale"
        }
      `}
    >
      <div
        className={`
          absolute
          inset-0
          bg-gradient-to-br
          ${rarity.glow}
          via-transparent
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        `}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/[0.04]
          "
        >
          {Icon ? <Icon className="h-7 w-7" /> : <Trophy className="h-7 w-7" />}
        </div>

        {unlocked ? (
          <div className="flex flex-col items-end gap-2">
            <span
              className={`
                rounded-full
                px-3
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-widest
                ${rarity.badge}
              `}
            >
              {achievement.rarity}
            </span>

            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
              Unlocked
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2">
            <Lock className="h-5 w-5 text-slate-500" />

            <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[10px] font-medium text-slate-400">
              Locked
            </span>
          </div>
        )}
      </div>

      <div className="relative mt-6">
        <h3 className="text-xl font-bold">
          {achievement.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {achievement.description}
        </p>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-amber-400" />
            {achievement.rewardPoints}
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-cyan-400" />
            {achievement.xp} XP
          </div>
        </div>

        {unlockedAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {unlockedAt}
          </div>
        )}
      </div>
    </div>
  );
}
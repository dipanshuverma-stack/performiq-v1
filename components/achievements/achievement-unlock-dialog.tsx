"use client";

import { Trophy } from "lucide-react";
import { ACHIEVEMENT_ICONS, type AchievementIconKey } from "@/lib/achievements/icons";
import { UnlockResult } from "@/lib/achievements/unlock";

interface AchievementUnlockDialogProps {
  open: boolean;
  achievements: UnlockResult[];
  onClose: () => void;
}

export default function AchievementUnlockDialog({
  open,
  achievements,
  onClose,
}: AchievementUnlockDialogProps) {
  // Safe-guard: Filter out any null elements to clean up the array for mapping
  const activeUnlocks = achievements.filter(
    (item): item is Exclude<UnlockResult, null> => item !== null
  );

  if (!open || activeUnlocks.length === 0) {
    return null;
  }

  // Grab the first unlocked achievement to show as the hero icon
  const latest = activeUnlocks[0].achievement;

  const Icon =
    ACHIEVEMENT_ICONS[
      latest.icon as AchievementIconKey
    ] ?? Trophy;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E121B] p-8 shadow-2xl">

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
            <Icon className="h-10 w-10 text-amber-400" />
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-white">
          {activeUnlocks.length > 1
            ? `${activeUnlocks.length} Achievements Unlocked`
            : "Achievement Unlocked"}
        </h2>

        <div className="mt-5 space-y-3">
          {activeUnlocks.map((result) => {
            const achievement = result.achievement;
            const AchievementIcon =
              ACHIEVEMENT_ICONS[
                achievement.icon as AchievementIconKey
              ] ?? Trophy;

            return (
              <div
                key={achievement.key}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                  <AchievementIcon className="h-6 w-6 text-amber-400" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {achievement.title}
                  </p>

                  <p className="text-sm text-slate-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue
        </button>

      </div>
    </div>
  );
}
import { AchievementCategory } from "@prisma/client";
import AchievementCard from "./achievement-card";

interface AchievementGridProps {
  achievements: any[];
}

const CATEGORY_ORDER = [
  AchievementCategory.PLANNER,
  AchievementCategory.PRACTICE,
  AchievementCategory.MOCK,
  AchievementCategory.STREAK,
  AchievementCategory.REWARD,
  AchievementCategory.REVISION,
  AchievementCategory.SPECIAL,
];

const CATEGORY_TITLES: Record<AchievementCategory, string> = {
  PLANNER: "Planner",
  PRACTICE: "Practice",
  MOCK: "Mock Tests",
  STREAK: "Study Streaks",
  REWARD: "Reward Points",
  REVISION: "Revision",
  SPECIAL: "Special",
};

export default function AchievementGrid({
  achievements,
}: AchievementGridProps) {
  return (
    <section className="space-y-10">
      {CATEGORY_ORDER.map((category) => {
        const items = achievements
          .filter(
            (achievement) => achievement.category === category
          )
          .sort((a, b) => {
            const aUnlocked = a.users.length > 0;
            const bUnlocked = b.users.length > 0;

            if (aUnlocked === bUnlocked) {
              return a.sortOrder - b.sortOrder;
            }

            return aUnlocked ? -1 : 1;
          });

        const unlockedCount = items.filter(
          (achievement) => achievement.users.length > 0
        ).length;

        const completion =
          items.length === 0
            ? 0
            : Math.round((unlockedCount / items.length) * 100);

        if (items.length === 0) {
          return null;
        }

        return (
          <section
            key={category}
            className="space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    CATEGORY
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {CATEGORY_TITLES[category]}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {unlockedCount}/{items.length}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Unlocked
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
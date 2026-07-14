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
        const items = achievements.filter(
          (achievement) => achievement.category === category
        );

        if (items.length === 0) {
          return null;
        }

        return (
          <section
            key={category}
            className="space-y-5"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                CATEGORY
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {CATEGORY_TITLES[category]}
              </h2>
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
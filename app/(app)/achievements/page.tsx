import { PageContainer } from "@/components/layout/page-container";
import { getAchievements, getPreparationJourney } from "./actions";

import { PreparationJourney } from "@/components/achievements/preparation-journey";
import AchievementsHeader from "@/components/achievements/achievements-header";
import AchievementOverview from "@/components/achievements/achievement-overview";
import AchievementGrid from "@/components/achievements/achievement-grid";

export default async function AchievementsPage() {
  const [data, activities] = await Promise.all([
    getAchievements(),
    getPreparationJourney(),
  ]);

  if (!data) {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-8">

        <AchievementsHeader />

        <AchievementOverview
          stats={data.stats}
        />

        <AchievementGrid
          achievements={data.achievements}
        />

        {/* Step 7: Premium Text Divider Intercept */}
        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#090D16] px-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold">
              Activity Timeline
            </span>
          </div>
        </div>

        <PreparationJourney
          activities={activities}
          achievements={data.achievements}
        />

      </div>
    </PageContainer>
  );
}
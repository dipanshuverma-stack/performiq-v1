import { PageContainer } from "@/components/layout/page-container";

import { getAchievements } from "./actions";

import AchievementsHeader from "@/components/achievements/achievements-header";
import AchievementOverview from "@/components/achievements/achievement-overview";
import AchievementGrid from "@/components/achievements/achievement-grid";

export default async function AchievementsPage() {
  const data = await getAchievements();

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

      </div>
    </PageContainer>
  );
}
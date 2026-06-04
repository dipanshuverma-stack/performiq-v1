import PracticePageClient from "@/components/practice/practice-page-client";
import RecentPracticeHistory from "@/components/practice/recent-practice-history";

export default function PracticePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <PracticePageClient />
      <RecentPracticeHistory />
    </div>
  );
}
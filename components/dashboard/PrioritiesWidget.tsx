// components/dashboard/PrioritiesWidget.tsx
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";

export async function PrioritiesWidget({ userId }: { userId: string }) {
  // Logic moved here - this will now stream independently
  const priorities = await getTopicPriorities(userId);
  const topPriorities = priorities.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold">Today's Priorities</h2>
      {/* ... render your topPriorities mapping ... */}
    </div>
  );
}
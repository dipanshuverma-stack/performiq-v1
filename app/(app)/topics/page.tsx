import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { TopicsDashboard } from "./topics-dashboard";

// 15. Cached User Lookup
const cachedGetUser = cache(async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
});

export default async function TopicsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  const priorities = await getTopicPriorities(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Topic Intelligence
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Comprehensive priority mapping based on practice accuracy, speed, mock insights, and unresolved mistakes.
        </p>
      </div>

      {/* Mount Interactive Client Component */}
      <TopicsDashboard initialPriorities={priorities} />
    </div>
  );
}
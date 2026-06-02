import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getWeakTopics } from "@/lib/analytics/weak-topics";
import { getStrongTopics } from "@/lib/analytics/strong-topics";
import { redirect } from "next/navigation";

// Explicit type interface for uniform metrics mapping
interface AnalyticTopic {
  id: string;
  topic: string;
  accuracy: number;
}

export default async function TopicsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Optimized Concurrent Processing Execution Layer: Fires off both queries simultaneously
  const [weakTopics, strongTopics] = await Promise.all([
    getWeakTopics(user.id) as Promise<AnalyticTopic[]>,
    getStrongTopics(user.id) as Promise<AnalyticTopic[]>,
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Topic Intelligence
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Real-time diagnostics mapping historical accuracy thresholds across subjects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Strong Topics Card - Independent Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-green-600">📈</span> Strongest Focus Areas
            </h2>
          </div>
          
          <div className="p-5">
            {strongTopics.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">
                Insufficient accuracy log history to isolate strong proficiencies.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {strongTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {topic.topic}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-md">
                      {topic.accuracy.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weak Topics Card - Independent Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-red-600">📉</span> Weakest Priority Topics
            </h2>
          </div>

          <div className="p-5">
            {weakTopics.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">
                No immediate systemic vulnerabilities identified within recent testing cycles.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {weakTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {topic.topic}
                    </span>
                    <span className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-md">
                      {topic.accuracy.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
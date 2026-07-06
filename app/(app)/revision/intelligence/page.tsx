import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getTopicPriorities } from "@/lib/intelligence/topic-priority";

const cachedGetUser = cache(async (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
);

export default async function SmartRevisionPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  const priorities = await getTopicPriorities(user.id);

  // Single pass categorization for better performance
  const highPriority = priorities.filter((p) => p.priority === "HIGH");
  const mediumPriority = priorities.filter((p) => p.priority === "MEDIUM");
  const lowPriority = priorities.filter((p) => p.priority === "LOW");

  // Sorted weak topics (non-mutating)
  const knowledgeWeakTopics = [...priorities]
    .sort((a, b) => a.knowledgeScore - b.knowledgeScore)
    .slice(0, 5);

  const speedWeakTopics = [...priorities]
    .sort((a, b) => a.speedScore - b.speedScore)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Smart Revision Hub</h1>
        <p className="text-slate-400 mt-2">AI-powered revision recommendations based on your performance</p>
      </div>

      {/* Today's Focus - High Priority */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          🔴 Today's Focus
        </h2>

        <div className="space-y-4">
          {highPriority.slice(0, 5).map((topic) => (
            <div
              key={topic.topic}
              className="border border-white/[0.08] rounded-2xl p-5 hover:border-rose-500/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{topic.topic}</h3>
                <span className="font-bold text-rose-400">Score: {topic.score}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>Knowledge: <span className="font-medium">{topic.knowledgeScore}%</span></div>
                <div>Speed: <span className="font-medium">{topic.speedScore}%</span></div>
              </div>

              {topic.reasons && topic.reasons.length > 0 && (
                <ul className="mt-4 text-sm text-slate-400 list-disc pl-5 space-y-1">
                  {topic.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge & Speed Weak Topics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6">Knowledge Weak Topics</h2>
          <div className="space-y-3">
            {knowledgeWeakTopics.map((topic) => (
              <div key={topic.topic} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span>{topic.topic}</span>
                <span className="font-medium text-amber-400">{topic.knowledgeScore}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6">Speed Weak Topics</h2>
          <div className="space-y-3">
            {speedWeakTopics.map((topic) => (
              <div key={topic.topic} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span>{topic.topic}</span>
                <span className="font-medium text-amber-400">{topic.speedScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Buckets */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="font-semibold mb-4 text-rose-400">🔴 High Priority</h2>
          <ul className="space-y-2 text-sm">
            {highPriority.map((topic) => (
              <li key={topic.topic} className="py-1">{topic.topic}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="font-semibold mb-4 text-amber-400">🟡 Medium Priority</h2>
          <ul className="space-y-2 text-sm">
            {mediumPriority.map((topic) => (
              <li key={topic.topic} className="py-1">{topic.topic}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="font-semibold mb-4 text-emerald-400">🟢 Low Priority</h2>
          <ul className="space-y-2 text-sm">
            {lowPriority.map((topic) => (
              <li key={topic.topic} className="py-1">{topic.topic}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
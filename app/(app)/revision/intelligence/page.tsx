import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTopicPriorities } from "@/lib/intelligence/topic-priority";
import { redirect } from "next/navigation";

export default async function SmartRevisionPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true, // Only retrieve the database index record key
    },
  });

  if (!user) {
    redirect("/login");
  }

  const priorities = await getTopicPriorities(user.id);

  const highPriority = priorities.filter((p) => p.priority === "HIGH");
  const mediumPriority = priorities.filter((p) => p.priority === "MEDIUM");
  const lowPriority = priorities.filter((p) => p.priority === "LOW");

  // Performance Fix: Avoid deep object mutations on large arrays using non-mutating toSorted
  const knowledgeWeakTopics = priorities
    .toSorted((a, b) => a.knowledgeScore - b.knowledgeScore)
    .slice(0, 5);

  const speedWeakTopics = priorities
    .toSorted((a, b) => a.speedScore - b.speedScore)
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">
        Smart Revision Hub
      </h1>

      {/* Today's Focus */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Today's Focus
        </h2>

        <div className="space-y-4">
          {highPriority.slice(0, 5).map((topic) => (
            <div
              key={topic.topic}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">
                  🔴 {topic.topic}
                </h3>

                <span className="font-bold">
                  Score: {topic.score}
                </span>
              </div>

              <div className="mt-3 text-sm">
                <p>
                  Knowledge: {topic.knowledgeScore}%
                </p>

                <p>
                  Speed: {topic.speedScore}%
                </p>
              </div>

              <ul className="mt-3 text-sm text-gray-600 list-disc pl-5">
                {topic.reasons.map((reason) => (
                  <li key={reason}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Weak */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Knowledge Weak Topics
        </h2>

        <div className="space-y-2">
          {knowledgeWeakTopics.map((topic) => (
            <div
              key={topic.topic}
              className="flex justify-between border-b pb-2"
            >
              <span>{topic.topic}</span>
              <span>{topic.knowledgeScore}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Speed Weak */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Speed Weak Topics
        </h2>

        <div className="space-y-2">
          {speedWeakTopics.map((topic) => (
            <div
              key={topic.topic}
              className="flex justify-between border-b pb-2"
            >
              <span>{topic.topic}</span>
              <span>{topic.speedScore}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Buckets */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">
            🔴 High Priority
          </h2>

          <ul className="space-y-2">
            {highPriority.map((topic) => (
              <li key={topic.topic}>
                {topic.topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">
            🟡 Medium Priority
          </h2>

          <ul className="space-y-2">
            {mediumPriority.map((topic) => (
              <li key={topic.topic}>
                {topic.topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">
            🟢 Low Priority
          </h2>

          <ul className="space-y-2">
            {lowPriority.map((topic) => (
              <li key={topic.topic}>
                {topic.topic}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
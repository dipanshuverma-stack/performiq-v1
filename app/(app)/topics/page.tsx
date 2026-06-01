import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getWeakTopics } from "@/lib/analytics/weak-topics";
import { getStrongTopics } from "@/lib/analytics/strong-topics";

export default async function TopicsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return (
      <div className="p-8">
        User not found
      </div>
    );
  }

  const weakTopics =
    await getWeakTopics(user.id);

  const strongTopics =
    await getStrongTopics(user.id);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Topic Intelligence
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Weak Topics
        </h2>
      <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-4">
    Strong Topics
  </h2>

  {strongTopics.length === 0 ? (
    <p className="text-gray-500">
      No topic data available.
    </p>
  ) : (
    <div className="space-y-2">
      {strongTopics.map((topic) => (
        <div
          key={topic.id}
          className="flex justify-between"
        >
          <span>
            {topic.topic}
          </span>

          <span className="text-green-600 font-semibold">
            {topic.accuracy.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )}
</div>

        {weakTopics.length === 0 ? (
          <p className="text-gray-500">
            No topic data available.
          </p>
        ) : (
          <div className="space-y-2">
            {weakTopics.map((topic: any) => (
              <div
                key={topic.id}
                className="flex justify-between"
              >
                <span>
                  {topic.topic}
                </span>

                <span className="text-red-600">
                  {topic.accuracy.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
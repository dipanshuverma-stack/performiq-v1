import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStudyCoach } from "@/lib/coach/study-coach";

export default async function CoachPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return null;
  }

  const coach = await getStudyCoach(user.id);

  const hasCoachData =
    coach.messages.length > 0 ||
    coach.focusTopics.length > 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Study Coach
      </h1>

      {!hasCoachData ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">
            🧠
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Study Coach Is Getting Ready
          </h2>

          <p className="text-gray-600 mb-2">
            Your coach needs more study data
            before giving personalized advice.
          </p>

          <p className="text-gray-500 mb-6">
            Complete practice sessions,
            revision tasks, and mock tests to
            unlock recommendations.
          </p>

          <a
            href="/practice"
            className="inline-flex px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Practicing
          </a>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-2">
              Coach Summary
            </h2>

            <p>
              {coach.focusTopics.length} focus
              topics identified and{" "}
              {coach.messages.length} coaching
              recommendations generated.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Today's Advice
            </h2>

            <ul className="space-y-3">
              {coach.messages.map((message) => (
                <li
                  key={message}
                  className="text-gray-700"
                >
                  • {message}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Focus Topics
            </h2>

            <div className="space-y-3">
              {coach.focusTopics.map((topic) => (
                <div key={topic.topic}>
                  <div className="font-medium">
                    {topic.topic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
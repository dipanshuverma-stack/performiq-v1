import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStudyCoach } from "@/lib/coach/study-coach";

export default async function CoachPage() {
  const session = await auth();

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session?.user?.email ?? "",
      },
    });

  if (!user) {
    return null;
  }

  const coach =
    await getStudyCoach(
      user.id
    );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Study Coach
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Today's Advice
        </h2>

        <ul className="space-y-3">
          {coach.messages.map(
            (message) => (
              <li
                key={message}
                className="text-gray-700"
              >
                • {message}
              </li>
            )
          )}
        </ul>

      </div>

      <div className="mt-6 bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Focus Topics
        </h2>

        <div className="space-y-3">
          {coach.focusTopics.map(
            (topic) => (
              <div
                key={topic.topic}
              >
                <div className="font-medium">
                  {topic.topic}
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
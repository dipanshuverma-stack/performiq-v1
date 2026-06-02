import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDailyPlan } from "@/lib/intelligence/daily-target-generator";

export default async function DailyPlanPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return null;
  }

  const plan = await getDailyPlan(user.id);

  const hasPlan =
    plan.practiceTopics.length > 0 ||
    plan.revisionTopics.length > 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Today's Plan
      </h1>

      {!hasPlan ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">
            📅
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Study Plan Available Yet
          </h2>

          <p className="text-gray-600 mb-2">
            We need a little more study data to
            generate personalized daily plans.
          </p>

          <p className="text-gray-500 mb-6">
            Complete practice sessions, revision,
            and mock tests to unlock AI-generated
            daily planning.
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
          {/* Summary Banner Component */}
          <div className="bg-blue-50 border rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-2 text-blue-900">
              Today's Focus
            </h2>

            <p className="text-blue-800">
              Practice {plan.practiceTopics.length} topics and revise{" "}
              {plan.revisionTopics.length} topics today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Practice Targets Column */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Practice
              </h2>

              <div className="space-y-3">
                {plan.practiceTopics.map((topic) => (
                  <div key={topic.topic}>
                    <div className="font-medium">
                      {topic.topic}
                    </div>

                    <div className="text-sm text-gray-500">
                      Target: {topic.targetQuestions} Questions
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision Targets Column */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Revision
              </h2>

              <div className="space-y-3">
                {plan.revisionTopics.map((topic) => (
                  <div
                    key={topic}
                    className="font-medium"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
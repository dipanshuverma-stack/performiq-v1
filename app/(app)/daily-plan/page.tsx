import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDailyPlan } from "@/lib/intelligence/daily-target-generator";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DailyPlanPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true, // Performance optimization: retrieve index ID only
    },
  });

  if (!user) {
    redirect("/login");
  }

  const plan = await getDailyPlan(user.id);

  const hasPlan =
    plan.practiceTopics.length > 0 ||
    plan.revisionTopics.length > 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">
        Today's Plan
      </h1>

      {!hasPlan ? (
        <div className="bg-white rounded-xl shadow p-12 text-center border">
          <div className="text-6xl mb-4">📅</div>

          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            No Study Plan Available Yet
          </h2>

          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            We need a little more study data to generate personalized daily plans.
          </p>

          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Complete practice sessions, revision tasks, and mock tests to unlock AI-generated daily planning.
          </p>

          <Link
            href="/practice"
            className="inline-flex px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Start Practicing
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Focus Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h2 className="font-semibold mb-2 text-blue-900 text-lg">
              Today's Focus Area
            </h2>

            <p className="text-blue-800">
              Practice <span className="font-bold">{plan.practiceTopics.length}</span> {plan.practiceTopics.length === 1 ? "topic" : "topics"} and revise{" "}
              <span className="font-bold">{plan.revisionTopics.length}</span> {plan.revisionTopics.length === 1 ? "topic" : "topics"} throughout your schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Practice Targets Panel */}
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Practice Targets
              </h2>

              <div className="space-y-4">
                {plan.practiceTopics.map((topic, idx) => (
                  <div 
                    key={`${topic.topic}-${idx}`}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {topic.topic}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Suggested module track
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-gray-900">
                        {topic.targetQuestions} Qs
                      </div>
                      <div className="text-xs text-gray-500">
                        Target Goal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision Targets Panel */}
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Revision Queue
              </h2>

              <div className="space-y-3">
                {plan.revisionTopics.map((topic, idx) => (
                  <div
                    key={`${topic}-${idx}`}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 font-medium text-gray-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-400 select-none" />
                    <span>{topic}</span>
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
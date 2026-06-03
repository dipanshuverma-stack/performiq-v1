import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStudyCoach } from "@/lib/coach/study-coach";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CoachPage() {
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

  const coach = await getStudyCoach(user.id);

  const hasCoachData =
    coach.messages.length > 0 ||
    coach.focusTopics.length > 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Study Coach</h1>

      {!hasCoachData ? (
        <div className="bg-white rounded-xl shadow p-12 text-center border">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Study Coach Is Getting Ready</h2>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            Your coach needs more study data before giving personalized advice.
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
          {/* Performance Snapshot Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">📈 Performance Snapshot</h2>
            <p>Accuracy: {coach.performance.accuracy.toFixed(1)}%</p>
            <p>Speed Score: {coach.performance.speedScore.toFixed(1)}%</p>
          </div>

          {/* Summary Status Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h2 className="font-semibold text-blue-900 mb-2 text-lg">Coach Status Summary</h2>
            <p className="text-blue-800">
              {coach.focusTopics.length} core focus {coach.focusTopics.length === 1 ? "topic" : "topics"} identified and{" "}
              {coach.messages.length} coaching {coach.messages.length === 1 ? "recommendation" : "recommendations"} generated.
            </p>
          </div>

          {/* Core Insights Module */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Today's Strategy Advice</h2>
            <ul className="space-y-3.5">
              {coach.messages.map((message, index) => (
                <li key={`${message}-${index}`} className="text-gray-700 flex items-start gap-3 text-sm md:text-base">
                  <span className="text-blue-500 font-bold select-none mt-0.5">•</span>
                  <span className="leading-relaxed">{message}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prioritized Areas Group */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Target Areas For Improvement</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {coach.focusTopics.map((topic, index) => (
                <div key={`${topic.topic}-${index}`} className="p-4 rounded-lg border bg-gray-50 border-gray-100 flex items-center justify-between">
                  <span className="font-medium text-gray-800">{topic.topic}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                    High Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
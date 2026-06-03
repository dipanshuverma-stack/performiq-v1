import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStudyCoach } from "@/lib/coach/study-coach";
import { getMockIntelligence } from "@/lib/intelligence/mock-intelligence";
import { redirect } from "next/navigation";
import { SmartLink as Link } from "@/components/smart-link";

export default async function CoachPage() {
  const session = await auth();

  // Extracts user.id from the custom session token, saving an expensive query
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Fetch backend coach advice models
  const coach = await getStudyCoach(userId);

  // 2. Query the latest raw historical test record with child datasets
  const latestMock = await prisma.mockTest.findFirst({
    where: {
      userId,
    },
    include: {
      subjectPerformances: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Map records cleanly into our functional intelligence layer
  const mockIntelligence = latestMock
    ? await getMockIntelligence(
        latestMock.subjectPerformances.map((s) => ({
          subject: s.subject,
          accuracy: s.accuracy,
        }))
      )
    : null;

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

          {/* Mock Intelligence Assessment Matrix */}
          {mockIntelligence && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Mock Intelligence
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Performance Level
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {mockIntelligence.performanceLevel}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Confidence Score
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {mockIntelligence.confidenceScore}%
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Target Accuracy
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {mockIntelligence.targetAccuracy}%
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Strongest Subject
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {mockIntelligence.strongestSubject ?? "N/A"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Weakest Subject
                  </p>
                  <p className="text-lg font-semibold text-rose-600">
                    {mockIntelligence.weakestSubject ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Recommended Practice Priority
                </h3>

                <div className="flex flex-wrap gap-2">
                  {mockIntelligence.recommendedPractice.map(
                    (subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                      >
                        {subject}
                      </span>
                    )
                  )}
                </div>

                {/* 🚀 UPGRADE: Natural Language Recommendation Callout Box */}
                <div className="mt-4 p-4 rounded-lg bg-slate-50 border">
                  <p className="text-sm text-slate-600 font-medium">
                    Coach Recommendation
                  </p>
                  <p className="font-medium mt-1 text-slate-800 leading-relaxed">
                    Focus primarily on{" "}
                    <span className="font-semibold text-rose-700">
                      {mockIntelligence.weakestSubject ?? "your weakest area"}
                    </span>{" "}
                    to move from{" "}
                    <span className="font-semibold text-slate-900">
                      {mockIntelligence.performanceLevel}
                    </span>{" "}
                    toward your target accuracy of{" "}
                    <span className="font-bold text-slate-900">
                      {mockIntelligence.targetAccuracy}%
                    </span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
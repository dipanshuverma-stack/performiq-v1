import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

import ExamForm from "@/components/exams/exam-form";
import ActivateButton from "@/components/exams/activate-button";

const cachedGetUserExams = cache(async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      examProfiles: {
        select: {
          id: true,
          name: true,
          examType: true,
          isActive: true,
          targetDate: true,
          readiness: true,
        },
      },
    },
  });
});

export default async function ExamsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await cachedGetUserExams(session.user.email);

  if (!user) redirect("/login");

  const activeExam = user.examProfiles.find((exam) => exam.isActive) ?? null;

  const daysRemaining = activeExam
    ? Math.ceil(
        (activeExam.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Exam Profiles
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your targets, deadlines, and active test schedules.
        </p>
      </div>

      <ExamForm />

      {/* Active Exam Panel */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
          Active Focus Target
        </h2>

        {activeExam ? (
          <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900">
                {activeExam.name}
              </h3>
              <p className="text-gray-500 text-sm">{activeExam.examType}</p>
            </div>

            <div className="space-y-2 sm:text-right sm:self-center">
              <p className="text-sm text-gray-700">
                🎯 Readiness:{" "}
                <span className="font-bold text-blue-600">
                  {activeExam.readiness.toFixed(1)}%
                </span>
              </p>
              <p className="text-sm text-gray-700">
                📅 Days Remaining:{" "}
                <span
                  className={`font-bold ${
                    daysRemaining !== null && daysRemaining <= 10
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {daysRemaining ?? "—"}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No active exam selected. Pick a target timeline below to generate recommendations.
          </p>
        )}
      </div>

      {/* All Exam Profiles */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Available Exam Profiles</h2>
        </div>

        {user.examProfiles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No exam profiles compiled yet. Create your first timeline using the form above.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {user.examProfiles.map((exam) => (
              <div
                key={exam.id}
                className="p-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-500">{exam.examType}</p>
                  <p className="text-xs text-gray-400">
                    Target Date:{" "}
                    {exam.targetDate.toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {exam.isActive ? (
                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Active Target
                    </span>
                  ) : (
                    <ActivateButton examId={exam.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

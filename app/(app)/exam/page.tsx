import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExamForm from "@/components/exams/exam-form";
import ActivateButton from "@/components/exams/activate-button";

export default async function ExamsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
    include: {
      examProfiles: true,
    },
  });

  const activeExam =
    user?.examProfiles.find(
      (exam) => exam.isActive
    ) ?? null;

  const daysRemaining = activeExam
    ? Math.ceil(
        (activeExam.targetDate.getTime() -
          Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">
        Exam Profiles
      </h1>

      <ExamForm />

      {/* Active Exam */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Active Exam
        </h2>

        {activeExam ? (
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              {activeExam.name}
            </h3>

            <p className="text-gray-500">
              {activeExam.examType}
            </p>

            <p>
              🎯 Readiness:{" "}
              <span className="font-semibold text-blue-600">
                {activeExam.readiness.toFixed(1)}%
              </span>
            </p>

            <p>
              📅 Days Remaining:{" "}
              <span className="font-semibold">
                {daysRemaining}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            No active exam selected.
          </p>
        )}
      </div>

      {/* All Profiles */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold">
            All Exam Profiles
          </h2>
        </div>

        {!user?.examProfiles.length ? (
          <div className="p-6 text-gray-500">
            No exam profiles yet.
          </div>
        ) : (
          <div className="divide-y">
            {user.examProfiles.map((exam) => (
              <div
                key={exam.id}
                className="p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {exam.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {exam.examType}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Target Date:{" "}
                    {exam.targetDate.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {exam.isActive ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  ) : (
                    <ActivateButton
                      examId={exam.id}
                    />
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
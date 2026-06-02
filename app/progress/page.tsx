import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSubjectProgress } from "@/lib/analytics/subject-progress";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true, // Performance optimization: pull only the ID needed for analytical joins
    },
  });

  if (!user) {
    redirect("/login");
  }

  const progress = await getSubjectProgress(user.id);
  const hasProgress = progress.length > 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Subject Progress
      </h1>

      {!hasProgress ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">
            📚
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Progress Data Yet
          </h2>

          <p className="text-gray-600 mb-2">
            Your subject progress will appear
            here as you complete syllabus topics.
          </p>

          <p className="text-gray-500 mb-6">
            Start marking topics as completed
            in the syllabus tracker.
          </p>

          <a
            href="/syllabus"
            className="inline-flex px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Open Syllabus
          </a>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-2 text-blue-900">
              Progress Summary
            </h2>

            <p className="text-blue-800">
              Tracking progress across {progress.length} subjects.
            </p>
          </div>

          <div className="space-y-6">
            {progress.map((subject) => (
              <div
                key={subject.subject}
                className="bg-white p-6 rounded-xl shadow"
              >
                <div className="flex justify-between mb-3">
                  <h2 className="font-semibold">
                    {subject.subject}
                  </h2>

                  <span>
                    {subject.percentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${subject.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {subject.completed} / {subject.total} Topics
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
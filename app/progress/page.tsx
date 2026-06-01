import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSubjectProgress } from "@/lib/analytics/subject-progress";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return null;
  }

  const progress =
    await getSubjectProgress(user.id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Subject Progress
      </h1>

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
              {subject.completed} /{" "}
              {subject.total} Topics
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
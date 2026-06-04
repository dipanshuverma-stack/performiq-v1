import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SmartLink as Link } from "@/components/smart-link";

export default async function RecentPracticeHistory() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) return null;

  const sessions = await prisma.practiceSession.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Recent Sessions
        </h2>

        <Link
          href="/practice/history"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500">
          No practice sessions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border rounded-lg p-3"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {session.subject} • {session.topic}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(
                      session.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {session.accuracy.toFixed(1)}%
                  </p>

                  <p className="text-xs text-gray-500">
                    Accuracy
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
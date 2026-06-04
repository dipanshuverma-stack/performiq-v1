import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PracticeHistoryPage() {
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

  // 🚀 CORE FIX: Enforce page boundaries and clear property selections
  const sessions = await prisma.practiceSession.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      subject: true,
      topic: true,
      createdAt: true,
      accuracy: true,
      totalQuestions: true,
      correctQuestions: true,
      incorrectQuestions: true,
      qpm: true,
      durationSeconds: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Strict performance line boundary
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Practice History
      </h1>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          No practice sessions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {session.subject} • {session.topic}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {session.accuracy.toFixed(1)}%
                  </p>

                  <p className="text-sm text-gray-500">
                    Accuracy
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold">
                    {session.totalQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Correct
                  </p>

                  <p className="font-semibold">
                    {session.correctQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Incorrect
                  </p>

                  <p className="font-semibold">
                    {session.incorrectQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    QPM
                  </p>

                  <p className="font-semibold">
                    {session.qpm.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Duration
                  </p>

                  <p className="font-semibold">
                    {Math.floor(session.durationSeconds / 60)}m{" "}
                    {session.durationSeconds % 60}s
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
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/lib/syllabus";
import { redirect } from "next/navigation";
import TopicButton from "@/components/syllabus/topic-button";

export default async function SyllabusPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Consolidated Database Query Pass
  const userWithProgress = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      topicProgress: {
        where: {
          completed: true,
        },
        select: {
          subject: true,
          topicName: true,
        },
      },
    },
  });

  if (!userWithProgress) {
    redirect("/login");
  }

  // O(1) Search Index Optimization: Convert entries to a Set hash structure
  const completedTopicsSet = new Set(
    userWithProgress.topicProgress.map((item) => `${item.subject}:${item.topicName}`)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Banking PO Syllabus Tracker
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Monitor topic coverage, log milestones, and update preparation metrics.
          </p>
        </div>
        {/* 🧠 Seed Button UI Container cleanly removed from this row layout block */}
      </div>

      <div className="space-y-6">
        {Object.entries(syllabus).map(([subject, topics]) => (
          <div
            key={subject}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 bg-gray-50/70">
              <h2 className="text-lg font-bold text-gray-800 capitalize">
                {subject}
              </h2>
            </div>

            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {topics.map((topic, index) => {
                const uniqueKey = `${subject}:${topic}`;
                const isCompleted = completedTopicsSet.has(uniqueKey);

                return (
                  <TopicButton
                    key={`${uniqueKey}-${index}`}
                    subject={subject}
                    topic={topic}
                    initialCompleted={isCompleted}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
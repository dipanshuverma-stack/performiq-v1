import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/lib/syllabus";
import { completeTopic } from "@/app/actions/topic-progress";
import { redirect } from "next/navigation";

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
                  <form key={`${uniqueKey}-${index}`} action={completeTopic}>
                    {/* Hidden inputs to safely pass context without using .bind() */}
                    <input type="hidden" name="subject" value={subject} />
                    <input type="hidden" name="topic" value={topic} />

                    <button
                      type="submit"
                      className={`w-full border rounded-xl p-4 text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isCompleted
                          ? "bg-green-50/50 border-green-200 text-green-900 focus:ring-green-500"
                          : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50/50 focus:ring-gray-900"
                      }`}
                    >
                      <span className={`text-sm font-medium ${isCompleted ? "line-through text-gray-400" : ""}`}>
                        {topic}
                      </span>
                      
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted 
                          ? "bg-green-600 border-green-600 text-white" 
                          : "border-gray-300 group-hover:border-gray-400 bg-white"
                      }`}>
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
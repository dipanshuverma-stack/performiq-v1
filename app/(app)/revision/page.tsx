import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { completeRevision } from "@/app/actions/revision";
import { redirect } from "next/navigation";

export default async function RevisionPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Optimized Query Pattern: Fetch user and historical data in a single DB pass
  const userWithRevisions = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      revisions: {
        select: {
          id: true,
          subject: true,
          topic: true,
          revisionCount: true,
          nextRevision: true,
        },
        orderBy: {
          nextRevision: "asc",
        },
      },
    },
  });

  if (!userWithRevisions) {
    redirect("/login");
  }

  const revisions = userWithRevisions.revisions;
  const totalTasks = revisions.length;

  // Track the current calendar boundary milestone
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Revision Schedule
        </h1>
        <p className="text-gray-500 mt-2">
          Review your spaced-repetition milestones to maximize long-term retention.
        </p>
      </div>

      {totalTasks === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow border border-gray-100 text-center">
          <div className="text-5xl mb-4 select-none">🎯</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your Schedule is Clear
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            Complete active topics from your syllabus to generate automated, systematic revision tasks here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {revisions.map((revision, index) => {
            const isOverdue = new Date(revision.nextRevision) < todayMidnight;
            
            // Cleanly bind our data payload argument ahead of submission execution
            const completeRevisionAction = completeRevision.bind(null, revision.id);

            return (
              <div
                key={`${revision.id}-${index}`}
                className={`bg-white p-6 rounded-xl shadow border transition-all flex flex-col justify-between ${
                  isOverdue 
                    ? "border-red-200 bg-red-50/10 hover:border-red-300" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                      {revision.subject}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        Overdue Task
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {revision.topic}
                  </h3>

                  <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-50">
                    <div>
                      <p className="text-gray-400 font-medium">Iteration</p>
                      <p className="font-semibold text-gray-700 mt-0.5">
                        Cycle #{revision.revisionCount + 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Target Date</p>
                      <p className={`font-semibold mt-0.5 ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                        {new Date(revision.nextRevision).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stably Bound Form Endpoint Submission Execution Frame */}
                <form action={completeRevisionAction} className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-gray-800 active:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Mark as Complete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
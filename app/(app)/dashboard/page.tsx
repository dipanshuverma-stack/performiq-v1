import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dailyPlan } from "@/lib/daily-plan";
import { startStudySession } from "@/app/actions/study-session";

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const studySessions = await prisma.studySession.findMany({
    where: {
      userId: user?.id,
    },
  });

  const totalMinutes = studySessions.reduce(
    (sum, studySession) => sum + studySession.duration,
    0
  );

  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">
          Welcome {session?.user?.name} 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Preparing for SBI PO • IBPS PO • RRB PO
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Study Time</h3>
            <p className="text-3xl font-bold mt-2">
              {totalHours}h
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Sessions Completed</h3>
            <p className="text-3xl font-bold mt-2">
              {studySessions.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">Mock Tests</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Today's Study Plan */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Today's Study Plan
          </h2>

          <div className="space-y-4">
            {dailyPlan.map((item) => (
              <div
                key={item.topic}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.subject}</p>
                  <p className="text-gray-600">{item.topic}</p>
                  <p className="text-sm text-gray-500">
                    {item.duration} min
                  </p>
                </div>

                <form
                  action={async () => {
                    "use server";

                    await startStudySession(
                      item.subject,
                      item.topic,
                      item.duration
                    );
                  }}
                >
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Start
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Upcoming Exams
          </h2>

          <div className="space-y-3">
            <div className="border rounded-lg p-4">
              SBI PO
            </div>

            <div className="border rounded-lg p-4">
              IBPS PO
            </div>

            <div className="border rounded-lg p-4">
              RRB PO
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
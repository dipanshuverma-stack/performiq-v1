import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syllabus } from "@/lib/syllabus";
import { completeTopic } from "@/app/actions/topic-progress";
import SeedButton from "@/components/syllabus/seed-button";

export default async function SyllabusPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const progress =
    await prisma.topicProgress.findMany({
      where: {
        userId: user?.id,
        completed: true,
      },
    });

  const completedTopics = progress.map(
    (item) => `${item.subject}:${item.topicName}`
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Banking PO Syllabus
      </h1>

      <div className="mb-6">
        <SeedButton />
      </div>

      {Object.entries(syllabus).map(
        ([subject, topics]) => (
          <div
            key={subject}
            className="bg-white rounded-xl p-6 shadow mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {subject}
            </h2>

            <div className="grid gap-2">
              {topics.map((topic) => {
                const isCompleted =
                  completedTopics.includes(
                    `${subject}:${topic}`
                  );

                return (
                  <form
                    key={topic}
                    action={async () => {
                      "use server";

                      await completeTopic(
                        subject,
                        topic
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className={`w-full border rounded-lg p-3 text-left transition ${
                        isCompleted
                          ? "bg-green-100 border-green-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {isCompleted
                        ? "✅"
                        : "⬜"}{" "}
                      {topic}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
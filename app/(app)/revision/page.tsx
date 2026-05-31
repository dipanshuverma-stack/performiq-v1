import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { completeRevision } from "@/app/actions/revision";

export default async function RevisionPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const revisions = await prisma.revision.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      nextRevision: "asc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Revision Schedule
      </h1>

      {revisions.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">
            No revisions scheduled yet.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Complete topics from the syllabus to generate
            revision tasks automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {revisions.map((revision) => (
            <div
              key={revision.id}
              className="bg-white p-4 rounded-xl shadow border"
            >
              <h3 className="font-semibold text-lg">
                {revision.subject}
              </h3>

              <p className="mt-1">
                {revision.topic}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Revision #{revision.revisionCount + 1}
              </p>

              <p className="text-sm text-gray-500">
                Due:{" "}
                {revision.nextRevision.toLocaleDateString()}
              </p>

              <form
                action={async () => {
                  "use server";
                  await completeRevision(revision.id);
                }}
                className="mt-4"
              >
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Complete Revision
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
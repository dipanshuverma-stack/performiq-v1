import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MockDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const mock = await prisma.mockTest.findUnique({
    where: {
      id,
    },
    include: {
      subjectPerformances: true,
      topicPerformances: true,
    },
  });

  if (!mock) {
    notFound();
  }

  const strongestSubject =
    mock.subjectPerformances.length > 0
      ? [...mock.subjectPerformances].sort(
          (a, b) => b.accuracy - a.accuracy
        )[0]
      : null;

  const weakestSubject =
    mock.subjectPerformances.length > 0
      ? [...mock.subjectPerformances].sort(
          (a, b) => a.accuracy - b.accuracy
        )[0]
      : null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">
            {mock.exam}
          </h1>

          {mock.mockType && (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
              {mock.mockType}
            </span>
          )}
        </div>

        {mock.title && (
          <p className="text-gray-600">
            {mock.title}
          </p>
        )}
      </div>

      {/* Overall Performance */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Overall Performance
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Score
            </p>

            <p className="text-2xl font-bold">
              {mock.score}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Accuracy
            </p>

            <p className="text-2xl font-bold text-green-600">
              {mock.accuracy.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Correct
            </p>

            <p className="text-2xl font-bold">
              {mock.correctAnswers}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Incorrect
            </p>

            <p className="text-2xl font-bold">
              {mock.incorrectAnswers}
            </p>
          </div>
        </div>
      </div>

      {/* Mock Statistics */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Mock Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Questions
            </p>

            <p className="font-semibold">
              {mock.totalQuestions}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Attempted
            </p>

            <p className="font-semibold">
              {mock.attemptedQuestions}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Unattempted
            </p>

            <p className="font-semibold">
              {mock.unattemptedQuestions}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Duration
            </p>

            <p className="font-semibold">
              {mock.duration ?? "-"} mins
            </p>
          </div>
        </div>
      </div>

      {/* Subject Intelligence */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            Strongest Subject
          </p>

          <p className="text-xl font-bold text-green-700">
            {strongestSubject?.subject ?? "-"}
          </p>

          {strongestSubject && (
            <p className="text-sm mt-1">
              {strongestSubject.accuracy.toFixed(1)}%
            </p>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            Weakest Subject
          </p>

          <p className="text-xl font-bold text-red-700">
            {weakestSubject?.subject ?? "-"}
          </p>

          {weakestSubject && (
            <p className="text-sm mt-1">
              {weakestSubject.accuracy.toFixed(1)}%
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            Subjects Recorded
          </p>

          <p className="text-xl font-bold text-blue-700">
            {mock.subjectPerformances.length}
          </p>
        </div>
      </div>

      {/* Subject Scores */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Subject Performance
        </h2>

        {mock.subjectPerformances.length === 0 ? (
          <div className="text-gray-500">
            No subject scores recorded.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {mock.subjectPerformances.map((subject) => (
              <div
                key={subject.id}
                className={`border rounded-xl p-4 ${
                  strongestSubject?.id === subject.id
                    ? "border-green-400 bg-green-50"
                    : weakestSubject?.id === subject.id
                    ? "border-red-400 bg-red-50"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    {subject.subject}
                  </h3>

                  <span className="text-2xl font-bold">
                    {subject.score}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">
                      Accuracy
                    </p>

                    <p className="font-semibold">
                      {subject.accuracy.toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Attempted
                    </p>

                    <p className="font-semibold">
                      {subject.attempted}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Correct
                    </p>

                    <p className="font-semibold text-green-600">
                      {subject.correct}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Incorrect
                    </p>

                    <p className="font-semibold text-red-600">
                      {subject.incorrect}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topic Performance */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Topic Performance
        </h2>

        <div className="bg-blue-50 border rounded-xl p-6">
          <h3 className="font-semibold mb-2">
            🚀 Coming Soon
          </h3>

          <ul className="space-y-2 text-gray-600">
            <li>• Topic Intelligence</li>
            <li>• Strongest Topics</li>
            <li>• Weakest Topics</li>
            <li>• Most Improved Topics</li>
            <li>• Most Neglected Topics</li>
          </ul>
        </div>
      </div>

      {/* Notes */}
      {mock.notes && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Notes
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {mock.notes}
          </p>
        </div>
      )}
    </div>
  );
}
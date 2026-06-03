import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getMockIntelligence } from "@/lib/intelligence/mock-intelligence";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MockDetailsPage({ params }: Props) {
  const { id } = await params;

  const mock = await prisma.mockTest.findUnique({
    where: { id },
    select: {
      id: true,
      exam: true,
      mockType: true,
      title: true,
      score: true,
      accuracy: true,
      correctAnswers: true,
      incorrectAnswers: true,
      totalQuestions: true,
      attemptedQuestions: true,
      unattemptedQuestions: true,
      duration: true,
      notes: true,
      subjectPerformances: {
        select: {
          id: true,
          subject: true,
          score: true,
          accuracy: true,
          attempted: true,
          correct: true,
          incorrect: true,
        },
      },
    },
  });

  if (!mock) {
    notFound();
  }

  const intelligence = await getMockIntelligence(
    mock.subjectPerformances.map((subject) => ({
      subject: subject.subject,
      accuracy: subject.accuracy,
    }))
  );

  const { strongestSubject, weakestSubject } = mock.subjectPerformances.reduce(
    (acc, current) => {
      if (!acc.strongestSubject || current.accuracy > acc.strongestSubject.accuracy) {
        acc.strongestSubject = current;
      }
      if (!acc.weakestSubject || current.accuracy < acc.weakestSubject.accuracy) {
        acc.weakestSubject = current;
      }
      return acc;
    },
    { strongestSubject: null as typeof mock.subjectPerformances[0] | null, weakestSubject: null as typeof mock.subjectPerformances[0] | null }
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header card info */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {mock.exam}
          </h1>
          {mock.mockType && (
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-600">
              {mock.mockType}
            </span>
          )}
        </div>
        {mock.title && <p className="text-gray-500 text-sm">{mock.title}</p>}
      </div>

      {/* Mock Intelligence Section */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Mock Intelligence
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-900 mb-3">🏆 Strong Areas</h3>
            {intelligence.strongestSubjects.length > 0 ? (
              <ul className="space-y-2">
                {intelligence.strongestSubjects.map((subject) => (
                  <li key={subject} className="text-green-800">• {subject}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-700">Not enough data</p>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-900 mb-3">⚠ Weak Areas</h3>
            {intelligence.weakestSubjects.length > 0 ? (
              <ul className="space-y-2">
                {intelligence.weakestSubjects.map((subject) => (
                  <li key={subject} className="text-red-800">• {subject}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-700">No major weak areas</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 mb-3">🎯 Recommended Practice</h3>
            {intelligence.recommendedPractice.length > 0 ? (
              <ul className="space-y-2">
                {intelligence.recommendedPractice.map((subject) => (
                  <li key={subject} className="text-blue-800">• {subject}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-blue-700">No recommendations yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Overall Performance Framework Metrics */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Overall Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{mock.score}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Accuracy</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{mock.accuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Correct</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{mock.correctAnswers}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Incorrect</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{mock.incorrectAnswers}</p>
          </div>
        </div>
      </div>

      {/* Mock Statistics */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Mock Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Questions</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{mock.totalQuestions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Attempted</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{mock.attemptedQuestions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Unattempted</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{mock.unattemptedQuestions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Duration</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{mock.duration ?? "-"} mins</p>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Subject Performance Breakdown</h2>
        {mock.subjectPerformances.length === 0 ? (
          <div className="text-gray-500 text-sm p-4 text-center">No diagnostic subject metadata found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {mock.subjectPerformances.map((subject, index) => {
              const isStrongest = strongestSubject?.id === subject.id;
              const isWeakest = weakestSubject?.id === subject.id;
              return (
                <div key={`${subject.id}-${index}`} className={`border rounded-xl p-4 transition-colors ${isStrongest ? "border-green-300 bg-green-50/30" : isWeakest ? "border-red-300 bg-red-50/30" : "border-gray-100 bg-gray-50/50"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{subject.subject}</h3>
                    <span className="text-2xl font-black text-gray-900">{subject.score}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><p className="text-gray-500 font-medium">Accuracy</p><p className="font-bold text-gray-900 mt-0.5">{subject.accuracy.toFixed(1)}%</p></div>
                    <div><p className="text-gray-500 font-medium">Attempted</p><p className="font-bold text-gray-900 mt-0.5">{subject.attempted}</p></div>
                    <div><p className="text-gray-500 font-medium">Correct</p><p className="font-bold text-green-600 mt-0.5">{subject.correct}</p></div>
                    <div><p className="text-gray-500 font-medium">Incorrect</p><p className="font-bold text-red-600 mt-0.5">{subject.incorrect}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {mock.notes && (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Notes & Observations</h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">{mock.notes}</p>
        </div>
      )}
    </div>
  );
}
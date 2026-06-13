import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getMockIntelligence } from "@/lib/intelligence/mock-intelligence";

type Props = { params: Promise<{ id: string }> };

export default async function MockDetailsPage({ params }: Props) {
  const { id } = await params;

  const mock = await prisma.mockTest.findUnique({
    where: { id },
    select: {
      id: true, exam: true, mockType: true, title: true, score: true, accuracy: true,
      correctAnswers: true, incorrectAnswers: true, totalQuestions: true,
      attemptedQuestions: true, unattemptedQuestions: true, duration: true, notes: true,
      subjectPerformances: {
        select: {
          id: true, subject: true, score: true, accuracy: true,
          attempted: true, correct: true, incorrect: true,
        },
      },
    },
  });

  if (!mock) notFound();

  const intelligence = getMockIntelligence(
    mock.subjectPerformances.map((s) => ({
      subject: s.subject,
      accuracy: s.accuracy,
    }))
  );

  const strongestRecord = mock.subjectPerformances.length > 0
    ? [...mock.subjectPerformances].sort((a, b) => b.accuracy - a.accuracy)[0]
    : null;

  const weakestRecord = mock.subjectPerformances.length > 0
    ? [...mock.subjectPerformances].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Mock Intelligence Summary */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Mock Intelligence</h2>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600">Strongest Subject</p>
            <p className="text-xl font-bold mt-2">{intelligence.strongestSubject ?? "-"}</p>
            <p className="text-xs text-gray-500 mt-1">
              {strongestRecord ? `${strongestRecord.accuracy.toFixed(1)}%` : "-"}
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-600">Weakest Subject</p>
            <p className="text-xl font-bold mt-2">{intelligence.weakestSubject ?? "-"}</p>
            <p className="text-xs text-gray-500 mt-1">
              {weakestRecord ? `${weakestRecord.accuracy.toFixed(1)}%` : "-"}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:col-span-3">
            <h3 className="font-bold text-blue-900 mb-2">🎯 Recommended Practice</h3>
            <div className="flex flex-wrap gap-2">
              {intelligence.recommendedPractice.map((s) => (
                <span key={s} className="px-3 py-1 bg-white border border-blue-100 rounded-full text-xs font-semibold text-blue-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Subject Breakdown</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mock.subjectPerformances.map((s) => {
            const isStrongest = strongestRecord?.id === s.id;
            const isWeakest = weakestRecord?.id === s.id;
            
            return (
              <div 
                key={s.id} 
                className={`border rounded-xl p-4 transition-colors ${
                  isStrongest ? "border-green-300 bg-green-50/30" : 
                  isWeakest ? "border-red-300 bg-red-50/30" : 
                  "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900">{s.subject}</h3>
                  <span className="text-2xl font-black text-gray-400">{s.score}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div><p className="text-gray-500">Accuracy</p><p className="font-bold">{s.accuracy.toFixed(1)}%</p></div>
                  <div><p className="text-gray-500">Attempted</p><p className="font-bold text-blue-600">{s.attempted}</p></div>
                  <div><p className="text-gray-500">Correct</p><p className="font-bold text-green-600">{s.correct}</p></div>
                  <div><p className="text-gray-500">Incorrect</p><p className="font-bold text-red-600">{s.incorrect}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
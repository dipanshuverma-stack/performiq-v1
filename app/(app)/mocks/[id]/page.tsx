import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { cn } from "@/lib/utils";

import { getMockIntelligence } from "@/lib/intelligence/mock-intelligence";

type Props = { params: Promise<{ id: string }> };

const cachedGetMock = cache(async (id: string) => {
  return prisma.mockTest.findUnique({
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
});

export default async function MockDetailsPage({ params }: Props) {
  const { id } = await params;

  const mock = await cachedGetMock(id);
  if (!mock) redirect("/mocks");

  const intelligence = getMockIntelligence(
    mock.subjectPerformances.map((s) => ({
      subject: s.subject,
      accuracy: s.accuracy,
    }))
  );

  // Optimized strongest/weakest calculation (single pass)
  let strongestRecord = null;
  let weakestRecord = null;

  if (mock.subjectPerformances.length > 0) {
    strongestRecord = [...mock.subjectPerformances].sort((a, b) => b.accuracy - a.accuracy)[0];
    weakestRecord = [...mock.subjectPerformances].sort((a, b) => a.accuracy - b.accuracy)[0];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-sm text-muted-foreground mb-1">MOCK ANALYSIS</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {mock.title || mock.exam}
        </h1>
        <p className="text-slate-400 mt-1">
          {mock.mockType} • {mock.exam}
        </p>
      </div>

      {/* Mock Intelligence */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Mock Intelligence</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
            <p className="text-sm text-green-400">Strongest Subject</p>
            <p className="text-xl font-bold mt-2 text-white">
              {intelligence.strongestSubject ?? "—"}
            </p>
            <p className="text-xs text-green-500 mt-1">
              {strongestRecord ? `${strongestRecord.accuracy.toFixed(1)}%` : "—"}
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <p className="text-sm text-red-400">Weakest Subject</p>
            <p className="text-xl font-bold mt-2 text-white">
              {intelligence.weakestSubject ?? "—"}
            </p>
            <p className="text-xs text-red-500 mt-1">
              {weakestRecord ? `${weakestRecord.accuracy.toFixed(1)}%` : "—"}
            </p>
          </div>

          <div className="lg:col-span-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
            <h3 className="font-semibold text-blue-400 mb-3">🎯 Recommended Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {intelligence.recommendedPractice.map((subject, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/5 border border-blue-500/20 rounded-full text-sm text-blue-300"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Subject Breakdown</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mock.subjectPerformances.map((s) => {
            const isStrongest = strongestRecord?.id === s.id;
            const isWeakest = weakestRecord?.id === s.id;

            return (
              <div
                key={s.id}
                className={cn(
                  "rounded-2xl border p-6 transition-all",
                  isStrongest && "border-green-500/30 bg-green-500/5",
                  isWeakest && "border-red-500/30 bg-red-500/5",
                  !isStrongest && !isWeakest && "border-white/[0.08]"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{s.subject}</h3>
                  <span className="text-3xl font-bold text-white tabular-nums">
                    {s.score}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs">ACCURACY</p>
                    <p className="font-semibold text-white">{s.accuracy.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">ATTEMPTED</p>
                    <p className="font-semibold text-blue-400">{s.attempted}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">CORRECT</p>
                    <p className="font-semibold text-emerald-400">{s.correct}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">INCORRECT</p>
                    <p className="font-semibold text-red-400">{s.incorrect}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import { createMockTest } from "@/app/actions/mock-test";
import {
  Target,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Clock,
  LayoutTemplate,
  HelpCircle
} from "lucide-react";
import SubjectPerformanceSection from "@/components/mock/SubjectPerformanceSection";
import SubjectPerformanceCard from "@/components/mock/SubjectPerformanceCard";
import TopicSelector from "@/components/mock/TopicSelector";
import { EXAMS } from "@/lib/exams";
import { SUBJECT_MAP } from "@/lib/mock/subject-map";
import { Subject } from "@prisma/client";

export default function MockForm() {
  // --- 1. State Management ---
  const [mockType, setMockType] = useState("");
  const [exam, setExam] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [expandedSubjects, setExpandedSubjects] = useState<
    Record<string, boolean>
  >({});

  const [weakTopics, setWeakTopics] = useState<Record<string, string[]>>({
    Reasoning: [], Quant: [], English: [], GA: [], Computer: [],
  });
  
  const [strongTopics, setStrongTopics] = useState<Record<string, string[]>>({
    Reasoning: [], Quant: [], English: [], GA: [], Computer: [],
  });

  const [subjectStats, setSubjectStats] = useState<
    Record<string, { score: number; questions: number; correct: number; incorrect: number }>
  >({
    Reasoning: { score: 0, questions: 0, correct: 0, incorrect: 0 },
    Quant: { score: 0, questions: 0, correct: 0, incorrect: 0 },
    English: { score: 0, questions: 0, correct: 0, incorrect: 0 },
    GA: { score: 0, questions: 0, correct: 0, incorrect: 0 },
    Computer: { score: 0, questions: 0, correct: 0, incorrect: 0 },
  });

  // --- 2. Derived Calculations ---
  const stats = useMemo(() => {
    const totalScore = Object.values(subjectStats).reduce((acc, curr) => acc + curr.score, 0);
    const totalQuestions = Object.values(subjectStats).reduce((acc, curr) => acc + curr.questions, 0);
    const totalCorrect = Object.values(subjectStats).reduce((acc, curr) => acc + curr.correct, 0);
    const totalIncorrect = Object.values(subjectStats).reduce((acc, curr) => acc + curr.incorrect, 0);
    const totalAttempted = totalCorrect + totalIncorrect;
    const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    
    return { totalScore, totalQuestions, totalCorrect, totalIncorrect, totalAttempted, accuracy };
  }, [subjectStats]);

  const isFormValid =
    !!mockType &&
    !!exam.trim() &&
    duration > 0 &&
    stats.totalQuestions > 0;

  // --- 3. Handlers ---
  const updateSubjectStat = (
    subject: string,
    field: keyof typeof subjectStats.Reasoning,
    value: number
  ) => {
    setSubjectStats((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: value },
    }));
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  // --- 4. Payloads ---
  const payloads = useMemo(() => ({
    weak: encodeURIComponent(JSON.stringify(weakTopics)),
    strong: encodeURIComponent(JSON.stringify(strongTopics)),
    stats: encodeURIComponent(JSON.stringify(subjectStats)),
  }), [weakTopics, strongTopics, subjectStats]);

  return (
    <form id="mock-form" action={createMockTest} className="space-y-8">
      {/* Hidden Fields for Server Actions */}
      <input type="hidden" name="weakTopics" value={payloads.weak} />
      <input type="hidden" name="strongTopics" value={payloads.strong} />
      <input type="hidden" name="subjectStats" value={payloads.stats} />
      <input type="hidden" name="score" value={stats.totalScore} />
      <input type="hidden" name="correctAnswers" value={stats.totalCorrect} />
      <input type="hidden" name="incorrectAnswers" value={stats.totalIncorrect} />
      <input type="hidden" name="totalQuestions" value={stats.totalQuestions} />

      {/* Basic Information Section */}
      <div>
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            BASIC INFORMATION
          </p>
          <div className="h-px bg-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <select
            name="mockType"
            value={mockType}
            onChange={(e) => setMockType(e.target.value)}
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/[0.2]"
            required
          >
            <option value="">Select Mock Type</option>
            <option value="PRELIMS">Prelims</option>
            <option value="MAINS">Mains</option>
          </select>

          <select
            name="exam"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white"
            required
          >
            <option value="">Select Exam</option>
            {EXAMS.map((exam) => (
              <option key={exam.value} value={exam.value}>
                {exam.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <input
            name="title"
            placeholder="Mock Title (Optional)"
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/[0.2]"
          />
        </div>
      </div>

      {!mockType ? (
        <div className="py-12 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02]">
          <LayoutTemplate className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">Select a Mock Type above to begin logging topics</p>
        </div>
      ) : (
        <>
          {/* Mock Summary Display */}
          <div>
            <div className="space-y-1 mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                MOCK SUMMARY
              </p>
              <div className="h-px bg-white/[0.06]" />
            </div>

            {/* Hierarchical Two-Row Metric Container */}
            <div className="space-y-4">
              
              {/* Top Row: Primary High-Level Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score */}
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 shadow-xl shadow-indigo-500/5">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-indigo-300">Score</p>
                  </div>
                  <p className="mt-2 text-5xl font-extrabold text-white">{stats.totalScore.toFixed(2)}</p>
                </div>

                {/* Accuracy */}
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 shadow-xl shadow-cyan-500/5">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-cyan-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-cyan-300">Accuracy</p>
                  </div>
                  <p className="mt-2 text-5xl font-extrabold text-white">{stats.accuracy.toFixed(1)}%</p>
                </div>

                {/* Duration */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 focus-within:border-blue-500/40 transition-all shadow-xl shadow-blue-500/5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-300">Duration</p>
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <input
                      type="number"
                      name="duration"
                      value={duration}
                      min={1}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-28 bg-transparent text-5xl font-extrabold text-white focus:outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <span className="pb-1 text-base text-slate-400/80 whitespace-nowrap">
                      min
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Core Quantitative Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Correct */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-300">Correct</p>
                  </div>
                  <p className="mt-2 text-4xl font-bold text-emerald-400">{stats.totalCorrect}</p>
                </div>

                {/* Incorrect / Wrong */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-rose-300">Wrong</p>
                  </div>
                  <p className="mt-2 text-4xl font-bold text-rose-400">{stats.totalIncorrect}</p>
                </div>

                {/* Attempted */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <CircleDashed className="h-4 w-4 text-amber-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-300">Attempted</p>
                  </div>
                  <p className="mt-2 text-4xl font-bold text-white">{stats.totalAttempted}</p>
                </div>

                {/* Questions */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-violet-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-300">Questions</p>
                  </div>
                  <p className="mt-2 text-4xl font-bold text-white">{stats.totalQuestions}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Dynamic Subjects Performance Section */}
          <SubjectPerformanceSection mockType={mockType as "PRELIMS" | "MAINS"}>
            {(subject) => {
              const currentStats = subjectStats[subject];
              
              return (
                <SubjectPerformanceCard
                  subject={subject}
                  score={currentStats?.score || 0}
                  questions={currentStats?.questions || 0}
                  correct={currentStats?.correct || 0}
                  incorrect={currentStats?.incorrect || 0}
                  onScoreChange={(v) => updateSubjectStat(subject, "score", v)}
                  onQuestionsChange={(v) => updateSubjectStat(subject, "questions", v)}
                  onCorrectChange={(v) => updateSubjectStat(subject, "correct", v)}
                  onIncorrectChange={(v) => updateSubjectStat(subject, "incorrect", v)}
                  expandable
                  expanded={!!expandedSubjects[subject]}
                  onToggle={() => toggleSubject(subject)}
                >
                  <TopicSelector
                    subject={SUBJECT_MAP[subject] as Subject}
                    weakTopics={weakTopics[subject]}
                    strongTopics={strongTopics[subject]}
                    onWeakChange={(topics) =>
                      setWeakTopics((prev) => ({ ...prev, [subject]: topics }))
                    }
                    onStrongChange={(topics) =>
                      setStrongTopics((prev) => ({ ...prev, [subject]: topics }))
                    }
                  />
                </SubjectPerformanceCard>
              );
            }}
          </SubjectPerformanceSection>

          {/* Notes */}
          <div>
            <div className="space-y-1 mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                NOTES
              </p>
              <div className="h-px bg-white/[0.06]" />
            </div>

            <textarea
              name="notes"
              placeholder="Notes / Learnings from this mock..."
              rows={5}
              className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/[0.2]"
            />
          </div>
        </>
      )}

      {/* Save Action CTA */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`
          h-14 w-full rounded-2xl font-bold tracking-[0.18em] uppercase transition-all
          ${isFormValid 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-900/30 text-white" 
            : "bg-white/[0.05] text-white/30 cursor-not-allowed"
          }
        `}
      >
        {isFormValid ? "SAVE MOCK TEST" : "INCOMPLETE DATA"}
      </button>
    </form>
  );
}
"use client";

import { Subject } from "@prisma/client";
import { SubjectPerformance } from "@/lib/analytics/practice-subject-analytics";

interface Props {
  data: SubjectPerformance[];
}

const SUBJECT_LABELS: Record<Subject, string> = {
  QUANTITATIVE_APTITUDE: "📐 Quantitative Aptitude",
  REASONING_ABILITY: "🧩 Reasoning Ability",
  ENGLISH_LANGUAGE: "✍️ English Language",
  GENERAL_AWARENESS: "🌍 General Awareness",
  COMPUTER_AWARENESS: "💻 Computer Awareness",
};

export default function SubjectPerformanceTable({
  data,
}: Props) {
  return (
    <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Subject Performance
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Accuracy and speed breakdown across all subjects
        </p>
      </div>

      <div className="space-y-5">
        {data.map((subject) => {
          const progress = Math.min(100, Math.round(subject.accuracy));

          const progressColor =
            progress >= 90 ? "bg-emerald-500" :
            progress >= 80 ? "bg-amber-500" : "bg-red-500";

          return (
            <div
              key={subject.subject}
              className="rounded-2xl border border-white/[0.08] p-5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {SUBJECT_LABELS[subject.subject]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {subject.sessions} Sessions
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-400">
                    {subject.accuracy}%
                  </div>
                  <div className="text-xs text-slate-400">Accuracy</div>
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className={`${progressColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Avg QPM</p>
                  <p className="font-bold text-white mt-1">{subject.qpm}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Questions</p>
                  <p className="font-bold text-white mt-1">{subject.totalQuestions}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Hours</p>
                  <p className="font-bold text-white mt-1">{subject.totalHours}</p>
                </div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No subject analytics available.
          </div>
        )}
      </div>
    </div>
  );
}
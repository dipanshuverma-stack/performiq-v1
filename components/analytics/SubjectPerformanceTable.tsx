
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
    <div className="bg-white rounded-2xl shadow border p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">
            Subject Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Accuracy and speed breakdown across all subjects
          </p>
        </div>
      </div>

      <div className="space-y-5">

        {data.map((subject) => {
          const progress = Math.min(
            100,
            Math.round(subject.accuracy)
          );

          const progressColor =
            progress >= 90
              ? "bg-emerald-500"
              : progress >= 80
              ? "bg-amber-500"
              : "bg-red-500";

          return (
            <div
              key={subject.subject}
              className="rounded-xl border p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="font-semibold text-lg">
                    {SUBJECT_LABELS[subject.subject]}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {subject.sessions} Sessions
                  </p>
                </div>

                <div className="text-right">

                  <div className="text-2xl font-bold">
                    {subject.accuracy}%
                  </div>

                  <div className="text-xs text-gray-500">
                    Accuracy
                  </div>

                </div>

              </div>

              <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`${progressColor} h-full rounded-full transition-all`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Avg QPM
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {subject.qpm}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Questions
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {subject.totalQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Hours
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {subject.totalHours}
                  </p>
                </div>

              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No subject analytics available.
          </div>
        )}

      </div>
    </div>
  );
}
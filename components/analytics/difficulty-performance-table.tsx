"use client";

import { Difficulty } from "@prisma/client";
import { DifficultyPerformance } from "@/lib/analytics/practice-difficulty-analytics";

interface Props {
  data: DifficultyPerformance[];
}

const LABELS: Record<Difficulty, string> = {
  EASY: "🟢 Easy",
  MEDIUM: "🟡 Medium",
  HARD: "🔴 Hard",
  MIXED: "🔵 Mixed",
  MAINS: "🟣 Mains",
};

export default function DifficultyPerformanceTable({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Difficulty Performance
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Compare your performance across difficulty levels.
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const progress = Math.round(item.accuracy);

          return (
            <div
              key={item.difficulty}
              className="border rounded-xl p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {LABELS[item.difficulty]}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.sessions} Sessions
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {item.accuracy}%
                  </p>

                  <p className="text-xs text-gray-500">
                    Accuracy
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
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

                  <p className="font-bold mt-1">
                    {item.qpm}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Questions
                  </p>

                  <p className="font-bold mt-1">
                    {item.totalQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Hours
                  </p>

                  <p className="font-bold mt-1">
                    {item.totalHours}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            No difficulty analytics available.
          </div>
        )}
      </div>
    </div>
  );
}
import { Subject } from "@prisma/client";
import { SUBJECT_LABELS } from "@/config/syllabus";

interface SubjectStatsProps {
  stats: Array<{
    subject: Subject;
    _count: { id: number };
    _avg: { accuracy: number | null };
  }>;
}

export function SubjectStats({ stats }: SubjectStatsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-gray-800 tracking-tight">
        Subject Analytics
      </h3>

      <div className="overflow-hidden rounded-xl border border-gray-100 text-xs">
        <div className="grid grid-cols-3 bg-gray-50 p-3 font-semibold text-gray-500 border-b border-gray-100">
          <span>Subject</span>
          <span className="text-center">Sessions</span>
          <span className="text-right">Avg Accuracy</span>
        </div>

        <div className="divide-y divide-gray-50">
          {stats.map((row) => {
            const accuracy = row._avg.accuracy ?? 0;

            return (
              <div
                key={row.subject}
                className="grid grid-cols-3 p-3 items-center font-medium text-gray-700"
              >
                <span className="font-semibold text-gray-900">
                  {SUBJECT_LABELS[row.subject]}
                </span>

                <span className="mx-auto rounded bg-gray-100/80 px-1.5 py-0.5 text-center text-gray-600">
                  {row._count.id}
                </span>

                <span
                  className={`text-right font-bold ${
                    accuracy >= 85
                      ? "text-emerald-600"
                      : accuracy >= 70
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {accuracy.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
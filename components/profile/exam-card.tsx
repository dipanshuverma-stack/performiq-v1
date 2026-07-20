import Link from "next/link";

type ExamCardProps = {
  activeExam: {
    name: string;
    daysLeft: number | null;
  } | null;
};

export function ExamCard({ activeExam }: ExamCardProps) {
  return (
    <Link
      href="/exams"
      className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all group flex flex-col justify-between h-full"
    >
      <div>
        <div className="mb-3 text-3xl">🎯</div>
        <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">
          Exam Profile
        </h3>

        <div className="mt-4 space-y-1">
          <p className="font-bold text-white text-xl">
            {activeExam?.name ?? "No Active Exam"}
          </p>
          <p className="text-sm font-medium text-blue-400">
            {activeExam?.daysLeft !== null && activeExam?.daysLeft !== undefined
              ? `${activeExam.daysLeft} Days Left`
              : "No Target Date"}
          </p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-blue-400 transition-colors">
          Manage →
        </span>
      </div>
    </Link>
  );
}
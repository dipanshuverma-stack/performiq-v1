type CurrentFocusCardProps = {
  activeExam: {
    name: string;
    daysLeft: number | null;
  } | null;
};

export function CurrentFocusCard({ activeExam }: CurrentFocusCardProps) {
  return (
    <section aria-labelledby="focus-section" className="space-y-4">
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 id="focus-section" className="text-xl font-semibold mb-6">
          Current Focus
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Active Exam
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {activeExam?.name ?? "None Selected"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Days Left
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {activeExam?.daysLeft !== null && activeExam?.daysLeft !== undefined
                ? `${activeExam.daysLeft} Days`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
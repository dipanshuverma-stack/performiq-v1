import { GlassCard } from "@/components/ui/glass-card";

type ActiveExamCardProps = {
  activeExam: {
    name: string;
    stage: string;
    customStage: string | null;
    targetDate: Date;
  } | null;
  daysRemaining: number | null;
};

export function ActiveExamCard({
  activeExam,
  daysRemaining,
}: ActiveExamCardProps) {
  return (
    <GlassCard glow>
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            CURRENT TARGET
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {activeExam?.name ?? "No Active Exam"}
          </h2>
          {activeExam && (
            <p className="mt-1 text-sm text-muted-foreground">
              {activeExam.stage === "CUSTOM"
                ? activeExam.customStage
                : activeExam.stage}
            </p>
          )}
        </div>

        {activeExam ? (
          <>
            <div className="border-t border-white/[0.08]" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Days Left
                </p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    daysRemaining !== null && daysRemaining <= 10
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {daysRemaining ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Target Date
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {activeExam.targetDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active exam selected. Pick a target timeline below to generate recommendations.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
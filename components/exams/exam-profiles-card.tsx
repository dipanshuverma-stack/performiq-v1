import { GlassCard } from "@/components/ui/glass-card";
import ActivateButton from "@/components/exams/activate-button";

type ExamProfilesCardProps = {
  examProfiles: {
    id: string;
    name: string;
    stage: string;
    customStage: string | null;
    targetDate: Date;
    isActive: boolean;
  }[];
};

export function ExamProfilesCard({ examProfiles }: ExamProfilesCardProps) {
  return (
    <GlassCard>
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            AVAILABLE EXAMS
          </p>
        </div>

        {examProfiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No exam profiles compiled yet. Create your first timeline using the form below.
          </p>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {examProfiles.map((exam) => (
              <div
                key={exam.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">{exam.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exam.stage === "CUSTOM"
                      ? exam.customStage
                      : exam.stage}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Target Date:{" "}
                    {exam.targetDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {exam.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ACTIVE
                    </span>
                  ) : (
                    <ActivateButton examId={exam.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
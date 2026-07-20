import { GlassCard } from "@/components/ui/glass-card";
import ExamForm from "@/components/exams/exam-form";

export function CreateExamSection() {
  return (
    <GlassCard>
      <div className="p-6 sm:p-8">
        <div>
          <h2
            id="create-exam-section"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            CREATE EXAM PROFILE
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add another exam target to track future preparation.
          </p>
        </div>

        <div className="my-6 border-t border-white/[0.08]" />

        <ExamForm />
      </div>
    </GlassCard>
  );
}
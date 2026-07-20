import { GlassCard } from "@/components/ui/glass-card";

export function HeroSection() {
  return (
    <section aria-labelledby="exam-profile-heading">
      <GlassCard glow>
        <div className="p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            EXAM PROFILES
          </span>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <h1
                id="exam-profile-heading"
                className="text-3xl sm:text-5xl font-black tracking-tight"
              >
                Manage Exam Targets
              </h1>

              <p className="mt-3 max-w-2xl text-muted-foreground text-lg leading-relaxed">
                Manage your active exam, future targets and preparation
                timelines. Your selected exam drives readiness, revision,
                analytics and dashboard insights across PerformIQ.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
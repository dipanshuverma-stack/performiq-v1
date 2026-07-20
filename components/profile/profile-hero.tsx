type HeroSectionProps = {
  user: {
    name: string | null;
  };
  activeExam: {
    name: string;
    daysLeft: number | null;
  } | null;
};

export function HeroSection({ user, activeExam }: HeroSectionProps) {
  return (
    <section aria-labelledby="profile-heading">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.04] to-transparent" />
        <div className="relative p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            PROFILE
          </span>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 id="profile-heading" className="text-3xl sm:text-5xl font-black tracking-tight">
                {user.name || "Banking Aspirant"}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">Banking Aspirant</p>
              <div className="mt-4 flex items-center gap-2 text-blue-400 font-medium">
                📍 {activeExam ? `${activeExam.name} Target Mode` : "No active exam selected"}
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                NEXT TARGET
              </p>
              <p className="mt-1 text-xl font-bold">{activeExam?.name ?? "—"}</p>
              <div className="mt-3 text-6xl font-black tracking-tighter text-blue-400">
                {activeExam?.daysLeft ?? "—"}
              </div>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
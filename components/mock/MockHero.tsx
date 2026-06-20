"use client";

interface MockHeroProps {
  stats: {
    totalMocks: number;
    averageAccuracy: number;
    bestScore: number;
    performanceLevel: string;
  };
  onAddMock: () => void;
}

export default function MockHero({
  stats,
  onAddMock,
}: MockHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B]">

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.04] to-transparent pointer-events-none" />

      <div className="relative p-8 space-y-5">

        {/* Top-right Add Button */}
        <div className="absolute right-8 top-8">
          <button
            onClick={onAddMock}
            className="
              h-11
              rounded-xl
              px-5
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              hover:from-blue-500
              hover:to-indigo-500
              text-sm
              font-semibold
              text-white
              transition-all
              shadow-lg
              shadow-indigo-900/30
              flex items-center gap-2
            "
          >
            + Add Mock
          </button>
        </div>

        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            MOCK INTELLIGENCE
          </span>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Mock Test Analytics
          </h1>

          <p className="max-w-2xl text-sm text-muted-foreground leading-7">
            Analyze your performance across mock tests, identify weak subjects, 
            monitor accuracy trends, and improve exam readiness through data-driven insights.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              TOTAL MOCKS
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              {stats.totalMocks}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              AVG ACCURACY
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              {stats.averageAccuracy.toFixed(1)}%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              BEST SCORE
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              {stats.bestScore}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              LEVEL
            </p>
            <h2 className="mt-2 text-2xl font-bold text-indigo-400">
              {stats.performanceLevel}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
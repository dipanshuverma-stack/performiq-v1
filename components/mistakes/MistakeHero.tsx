"use client";

interface MistakeHeroProps {
  onLogMistake: () => void;
}

export function MistakeHero({ onLogMistake }: MistakeHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/[0.04] to-transparent pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-10">

        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            MISTAKE INTELLIGENCE
          </span>

          <div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight">
              Mistake Book
            </h1>

            <p className="mt-4 max-w-3xl text-muted-foreground text-lg leading-8">
              Review recurring mistakes, identify weak concepts, and build a
              permanent feedback loop to eliminate repeated errors and improve
              exam performance.
            </p>
          </div>
        </div>

        <button
          onClick={onLogMistake}
          className="
            h-12
            rounded-xl
            bg-gradient-to-r
            from-red-600
            to-orange-500
            px-6
            font-semibold
            transition-all
            hover:scale-[1.02]
            hover:shadow-lg
            hover:shadow-red-500/20
          "
        >
          + Log Mistake
        </button>

      </div>
    </div>
  );
}
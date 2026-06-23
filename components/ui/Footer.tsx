import { appConfig } from "@/lib/app-config";

export function Footer() {
  return (
    <footer className="mt-24 pb-10">
      <div className="mx-auto max-w-7xl px-8">
        <div
          className="
            rounded-3xl
            border
            border-white/[0.06]
            bg-gradient-to-b
            from-white/[0.03]
            to-white/[0.01]
            backdrop-blur-xl
            py-10 px-8
            text-center
            overflow-hidden
            relative
          "
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
  <h2 className="text-2xl font-bold text-white">
    {appConfig.name}
  </h2>

  <p className="mt-2 text-sm text-slate-400">
    Banking Exam Preparation Operating System
  </p>

  <p className="mt-5 text-sm text-slate-300">
    Built with ❤️ by{" "}
    <span className="font-semibold text-white">
      Dipanshu Verma
    </span>
  </p>

  <div className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-500">
    <span>SBI PO</span>
    <span>•</span>
    <span>IBPS PO</span>
    <span>•</span>
    <span>RRB PO</span>

    <span className="mx-2 text-slate-700">|</span>

    <span>v1.0 Stable</span>
  </div>
</div>
        </div>
      </div>
    </footer>
  );
}
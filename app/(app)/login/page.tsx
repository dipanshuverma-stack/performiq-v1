import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2">
          
          {/* Left Side */}
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              PerformIQ
            </span>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Banking Exam
              <br />
              Preparation OS
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-400">
              Track syllabus progress, manage revisions,
              analyze performance and prepare smarter for
              SBI PO, IBPS PO and RRB PO.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <span>📚</span>
                <span>Syllabus Intelligence</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <span>🔁</span>
                <span>Smart Revision Engine</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <span>⚡</span>
                <span>Practice Analytics</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <span>📈</span>
                <span>Mock Intelligence</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            <div className="w-full rounded-3xl border border-white/[0.08] bg-[#0E121B] p-10 backdrop-blur-xl">
              <h2 className="text-3xl font-black">
                Welcome Back
              </h2>

              <p className="mt-3 text-slate-400">
                Continue your preparation journey.
              </p>

              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
                className="mt-8"
              >
                <button
                  className="
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    py-4
                    font-semibold
                    text-white
                    transition-all
                    hover:from-blue-500
                    hover:to-indigo-500
                    hover:scale-[1.01]
                  "
                >
                  Continue with Google
                </button>
              </form>

              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <p className="text-sm text-slate-500">
                  Preparing for SBI PO • IBPS PO • RRB PO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-sm text-slate-600">
          Built with ❤️ by Dipanshu Verma
        </p>
      </div>
    </div>
  );
}
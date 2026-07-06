import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const upcomingExams = [
  {
    name: "SBI PO Prelims",
    days: 41,
  },
  {
    name: "IBPS PO Prelims",
    days: 57,
  },
  {
    name: "RRB PO",
    days: 72,
  },
];

const features = [
  {
    icon: "📚",
    title: "Syllabus Intelligence",
    description: "Track every topic across your preparation journey.",
  },
  {
    icon: "🔁",
    title: "Revision Engine",
    description: "Spaced repetition system for long-term retention.",
  },
  {
    icon: "⚡",
    title: "Practice Analytics",
    description: "Measure speed, accuracy and consistency.",
  },
  {
    icon: "📈",
    title: "Mock Intelligence",
    description: "Understand readiness and weak areas.",
  },
];

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[180px]" />
        <div className="absolute bottom-20 right-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[180px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center">
          <span className="mb-6 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs uppercase tracking-[0.25em] text-slate-400">
            PerformIQ
          </span>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight">
            Banking Exam
            <br />
            Preparation OS
          </h1>

          <p className="mt-8 max-w-3xl text-lg md:text-xl text-slate-400 leading-8">
            Track syllabus progress, revision cycles, practice performance,
            mock intelligence and preparation readiness in one unified system.
          </p>

          <div className="mt-10">
            <Link
              href="/api/auth/signin"
              className="
                inline-flex
                items-center
                justify-center
                h-14
                px-10
                rounded-2xl
                font-bold
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-500
                hover:to-indigo-500
                hover:scale-105
                transition-all
                duration-300
                shadow-lg
                shadow-blue-500/20
              "
            >
              Continue with Google
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Preparing for SBI PO • IBPS PO • RRB PO
          </p>
        </section>

        {/* Stats */}
        <section className="pb-24">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              { value: "5", label: "Subjects" },
              { value: "200+", label: "Topics" },
              { value: "∞", label: "Revision Cycles" },
              { value: "Advanced", label: "Analytics" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8"
              >
                <h3 className="text-4xl font-black text-blue-400">
                  {stat.value}
                </h3>
                <p className="mt-2 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black">Everything You Need</h2>
            <p className="mt-4 text-slate-400">
              Built specifically for serious banking aspirants.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8 transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-24 text-center">
          <h2 className="text-5xl font-black">Ready To Level Up?</h2>
          <p className="mt-4 text-slate-400">
            Join PerformIQ and transform preparation into measurable progress.
          </p>

          <Link
            href="/api/auth/signin"
            className="inline-flex mt-8 h-14 items-center justify-center rounded-2xl px-10 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-105"
          >
            Continue with Google
          </Link>
        </section>

        {/* Footer */}
        <footer className="pb-12 text-center">
          <p className="text-sm text-slate-500">
            Built with ❤️ by Dipanshu Verma
          </p>
        </footer>
      </div>
    </main>
  );
}
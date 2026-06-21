import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { completeRevision } from "@/app/actions/revision";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SUBJECT_LABELS } from "@/config/syllabus";

export default async function RevisionPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      revisions: {
        select: { id: true, subject: true, topic: true, revisionCount: true, nextRevision: true },
        orderBy: { nextRevision: "asc" },
      },
    },
  });

  if (!user) redirect("/login");

  // 1. Mutually Exclusive Bucket Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const overdue = user.revisions.filter((r) => new Date(r.nextRevision) < today);
  const dueToday = user.revisions.filter((r) => {
    const date = new Date(r.nextRevision);
    return date >= today && date < tomorrow;
  });
  const upcoming = user.revisions.filter((r) => new Date(r.nextRevision) >= tomorrow);

  // 2. Metrics
  const retentionHealth =
    user.revisions.length === 0
      ? 100
      : Math.round(((user.revisions.length - overdue.length) / user.revisions.length) * 100);

  const nextTarget = overdue[0] || dueToday[0] || upcoming[0];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Debug Block */}
      <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-4 text-xs font-mono text-slate-400">
        <p>Total Revisions: {user.revisions.length}</p>
        <p>Overdue: {overdue.length} | Due Today: {dueToday.length} | Upcoming: {upcoming.length}</p>
      </div>

      {/* Hero */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Revision Engine</span>
        <h1 className="mt-4 text-4xl font-black">Stay Retention Focused</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Track upcoming revisions, clear overdue topics and maintain long-term memory retention.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-4">
        <div className="md:col-span-1 rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Retention Health</p>
          <h2 className="mt-2 text-4xl font-black text-blue-400">{retentionHealth}%</h2>
        </div>
        <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Overdue</p>
          <h2 className="mt-2 text-4xl font-black text-red-400">{overdue.length}</h2>
        </div>
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Due Today</p>
          <h2 className="mt-2 text-4xl font-black text-amber-400">{dueToday.length}</h2>
        </div>
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Upcoming</p>
          <h2 className="mt-2 text-4xl font-black text-blue-400">{upcoming.length}</h2>
        </div>
      </div>

      {/* Featured Revision */}
      {nextTarget && (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">Next Revision</span>
            <h2 className="text-3xl font-black mt-2 text-white">{nextTarget.topic}</h2>
            <p className="text-amber-400/80 mt-1 font-medium">Cycle #{nextTarget.revisionCount + 1}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/practice?subject=${nextTarget.subject}&topic=${encodeURIComponent(nextTarget.topic)}`}
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20"
            >
              START REVISION →
            </Link>
            <form action={completeRevision.bind(null, nextTarget.id)}>
              <button className="h-full px-6 rounded-2xl border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-bold transition-all" title="Mark as Complete">
                ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Segmented Queue */}
      <div className="space-y-12">
        {[
          { title: "Overdue", list: overdue, color: "text-red-400" },
          { title: "Due Today", list: dueToday, color: "text-amber-400" },
          { title: "Upcoming", list: upcoming, color: "text-blue-400" },
        ].map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className={cn("text-lg font-semibold", section.color)}>
              {section.title} ({section.list.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.list.map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.02]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full">
                        {SUBJECT_LABELS[r.subject] ?? r.subject.replaceAll("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Cycle #{r.revisionCount + 1}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">
                      {r.topic}
                    </h4>
                  </div>
                  <form action={completeRevision.bind(null, r.id)} className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/20"
                    >
                      Mark as Complete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
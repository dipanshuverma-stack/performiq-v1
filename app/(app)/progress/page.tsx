import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSyllabusData } from "@/lib/syllabus/getSyllabusData";
import { cn } from "@/lib/utils";   // ← Added this import

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/login");

  const syllabusData = await getSyllabusData(user.id);
  const hasProgress = syllabusData.subjects.length > 0;

  const recentActivity = await prisma.topicProgress.findMany({
    where: { 
      userId: user.id, 
      completed: true 
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const completedTopics = syllabusData.progress.completedCount;
  const totalTopics = syllabusData.progress.totalCount;
  const completionRate = Math.round(syllabusData.progress.percentage);
  const remainingTopics = totalTopics - completedTopics;
  const activeSubjects = syllabusData.subjects.length;

  const subjectStats = syllabusData.subjects.map((subject) => ({
    ...subject,
    percentage: subject.totalCount === 0 ? 0 : Math.round((subject.completedCount / subject.totalCount) * 100),
  }));

  const strongSubjects = subjectStats.filter((s) => s.percentage >= 75).length;
  const averageSubjects = subjectStats.filter((s) => s.percentage >= 40 && s.percentage < 75).length;
  const weakSubjects = subjectStats.filter((s) => s.percentage < 40).length;
  const readinessScore = subjectStats.length > 0 
    ? Math.round(subjectStats.reduce((sum, s) => sum + s.percentage, 0) / subjectStats.length) 
    : 0;

  const spotlightSubject = [...subjectStats].sort((a, b) => b.percentage - a.percentage)[0];

  if (!hasProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-7xl mb-6">📚</div>
          <h2 className="text-3xl font-bold mb-4">No Progress Yet</h2>
          <p className="text-slate-400 mb-8">Start tracking your syllabus to unlock detailed progress insights.</p>
          <a 
            href="/syllabus" 
            className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold text-white transition"
          >
            Begin Syllabus Tracking
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Hero */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">PROGRESS OVERVIEW</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">{completionRate}% Complete</h1>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Completed", val: completedTopics, color: "text-emerald-400" },
          { label: "Remaining", val: remainingTopics, color: "text-amber-400" },
          { label: "Completion", val: `${completionRate}%`, color: "text-blue-400" },
          { label: "Subjects", val: activeSubjects, color: "text-white" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
            <div className={`mt-3 text-4xl font-black ${kpi.color}`}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* Preparation Health */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">PREPARATION HEALTH</p>
            <h2 className="mt-2 text-4xl font-black text-white">{readinessScore}%</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center sm:text-left">
            <p className="text-sm text-emerald-400">Strong Subjects</p>
            <p className="mt-2 text-4xl font-bold text-emerald-400">{strongSubjects}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center sm:text-left">
            <p className="text-sm text-amber-400">Average Subjects</p>
            <p className="mt-2 text-4xl font-bold text-amber-400">{averageSubjects}</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-center sm:text-left">
            <p className="text-sm text-red-400">Weak Subjects</p>
            <p className="mt-2 text-4xl font-bold text-red-400">{weakSubjects}</p>
          </div>
        </div>
      </div>

      {/* Subject Spotlight */}
      {spotlightSubject && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-400">TOP PERFORMING SUBJECT</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold">{spotlightSubject.title}</h2>
            </div>
            <div className="text-right">
              <div className="text-5xl sm:text-6xl font-black text-blue-400">{spotlightSubject.percentage}%</div>
            </div>
          </div>
          <div className="mt-6 h-3 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${spotlightSubject.percentage}%` }} />
          </div>
        </div>
      )}

      {/* Subject Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjectStats.map((subject) => (
          <div key={subject.key} className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{subject.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {subject.completedCount} / {subject.totalCount}
                </p>
              </div>
              <div className="text-4xl font-black text-blue-400">{subject.percentage}%</div>
            </div>

            <div className="mt-6 h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${subject.percentage}%` }} />
            </div>

            <div className="mt-4">
              <span className={cn(
                "inline-block rounded-full px-4 py-1 text-xs font-medium",
                subject.percentage >= 75 ? "bg-emerald-500/10 text-emerald-400" :
                subject.percentage >= 40 ? "bg-amber-500/10 text-amber-400" : 
                "bg-red-500/10 text-red-400"
              )}>
                {subject.percentage >= 75 ? "Strong" : subject.percentage >= 40 ? "In Progress" : "Needs Work"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Recent Progress</h2>
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/[0.05] p-5">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">✓</div>
                <div>
                  <p className="font-medium">{item.topicName}</p>
                  <p className="text-sm text-muted-foreground">{item.subject.replaceAll("_", " ")}</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Completed</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No recent activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
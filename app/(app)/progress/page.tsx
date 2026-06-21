import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSyllabusData } from "@/lib/syllabus/getSyllabusData";
import { redirect } from "next/navigation";

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

  // 1. Fetch Recent Activity
  const recentActivity = await prisma.topicProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
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
  const readinessScore = Math.round(subjectStats.reduce((sum, s) => sum + s.percentage, 0) / subjectStats.length);

  const spotlightSubject = [...subjectStats].sort((a, b) => b.percentage - a.percentage)[0];

  if (!hasProgress) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="rounded-3xl border border-dashed border-white/[0.08] bg-[#0E121B] p-10 text-center">
          <div className="text-7xl mb-6">📚</div>
          <h2 className="text-2xl font-bold mb-3">No Progress Yet</h2>
          <a href="/syllabus" className="inline-flex px-8 py-3 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all">Begin Syllabus Tracking</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 1. Hero */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Progress Overview</span>
        <h1 className="mt-4 text-4xl font-black">{completionRate}% Complete</h1>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid gap-5 md:grid-cols-4">
        {[
          { label: "Completed", val: completedTopics, color: "text-emerald-400" },
          { label: "Remaining", val: remainingTopics, color: "text-amber-400" },
          { label: "Completion", val: `${completionRate}%`, color: "text-blue-400" },
          { label: "Subjects", val: activeSubjects, color: "text-white" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{kpi.label}</p>
            <div className={`mt-3 text-4xl font-black ${kpi.color}`}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* 3. Preparation Health */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preparation Health</p>
            <h2 className="mt-2 text-3xl font-black">{readinessScore}%</h2>
            <p className="text-muted-foreground mt-2">Based on syllabus completion</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm text-muted-foreground">Strong Subjects</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{strongSubjects}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm text-muted-foreground">Average Subjects</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{averageSubjects}</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-muted-foreground">Weak Subjects</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{weakSubjects}</p>
          </div>
        </div>
      </div>

      {/* 4. Subject Spotlight */}
      <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Top Performing Subject</p>
            <h2 className="mt-3 text-3xl font-black">{spotlightSubject?.title}</h2>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black text-blue-400">{spotlightSubject?.percentage}%</div>
            <p className="text-sm text-muted-foreground">Completion</p>
          </div>
        </div>
        <div className="mt-8 h-3 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${spotlightSubject?.percentage ?? 0}%` }} />
        </div>
      </div>

      {/* 5. Subject Progress Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {subjectStats.map((subject) => (
          <div key={subject.key} className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{subject.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{subject.completedCount} / {subject.totalCount} Topics</p>
              </div>
              <div className="text-3xl font-black text-blue-400">{subject.percentage}%</div>
            </div>
            <div className="mt-4 mb-3">
              <span className={subject.percentage >= 75 ? "rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs" : subject.percentage >= 40 ? "rounded-full bg-amber-500/10 text-amber-400 px-3 py-1 text-xs" : "rounded-full bg-red-500/10 text-red-400 px-3 py-1 text-xs"}>
                {subject.percentage >= 75 ? "Strong" : subject.percentage >= 40 ? "In Progress" : "Needs Work"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${subject.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* 6. Recent Activity */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-semibold mb-6">Recent Progress Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">✓</div>
                <div>
                  <p className="font-medium">{item.topicName}</p>
                  <p className="text-sm text-muted-foreground">{item.subject.replaceAll("_", " ")}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No completed topics yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
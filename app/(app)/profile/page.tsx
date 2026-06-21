import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

// 1. Dynamic Days Calculation
function getDaysLeft(dateString: string) {
  const today = new Date();
  const target = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const exams = [
  { name: "SBI PO PRELIMS", date: "2026-08-01" },
  { name: "IBPS PO PRELIMS", date: "2026-08-17" },
  { name: "SBI PO MAINS", date: "2026-09-01" },
  { name: "IBPS PO MAINS", date: "2026-10-12" },
].map((exam) => ({
  ...exam,
  daysLeft: getDaysLeft(exam.date),
}));

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true },
  });
  if (!user) redirect("/login");

  const sortedExams = [...exams].sort((a, b) => a.daysLeft - b.daysLeft);
  const featuredExam = sortedExams[0];
  const remainingExams = sortedExams.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.04] to-transparent" />
        <div className="relative p-8">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">PROFILE</span>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-tight">{user.name || "Banking Aspirant"}</h1>
              <p className="mt-3 text-xl text-muted-foreground">Banking Aspirant</p>
              <div className="mt-3 flex items-center gap-2 text-blue-400 font-medium"><span>📍 {featuredExam.name} Target Mode</span></div>
              <p className="mt-5 text-muted-foreground">Preparing for {sortedExams.length} Active Exam Targets</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next Target</p>
              <p className="mt-2 text-xl font-bold">{featuredExam.name}</p>
              <div className="mt-4 text-6xl font-black tracking-tighter text-blue-400">{featuredExam.daysLeft}</div>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <button className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 text-left hover:border-blue-500/30 transition-all">
          <div className="mb-3 text-2xl">📅</div>
          <h3 className="font-semibold">Add Exam</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create target exam</p>
        </button>
        <Link href="/dashboard" className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all">
          <div className="mb-3 text-2xl">📊</div>
          <h3 className="font-semibold">Dashboard</h3>
          <p className="mt-1 text-sm text-muted-foreground">View progress</p>
        </Link>
        <Link href="/settings" className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all">
          <div className="mb-3 text-2xl">⚙️</div>
          <h3 className="font-semibold">Settings</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage account</p>
        </Link>
      </div>

      {/* 3. Preparation Focus */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-semibold mb-6">Current Focus</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <div><p className="text-sm text-muted-foreground">Exam</p><p className="mt-1 text-lg font-semibold">SBI PO</p></div>
          <div><p className="text-sm text-muted-foreground">Stage</p><p className="mt-1 text-lg font-semibold">Prelims</p></div>
          <div><p className="text-sm text-muted-foreground">Days Left</p><p className="mt-1 text-lg font-semibold text-blue-400">{featuredExam.daysLeft}</p></div>
          <div><p className="text-sm text-muted-foreground">Priority Subject</p><p className="mt-1 text-lg font-semibold">Quantitative Aptitude</p></div>
        </div>
      </div>

      {/* 4. Upcoming Exams */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-2xl font-semibold mb-8">Upcoming Exams</h2>
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Closest Exam</p>
          <h3 className="mt-4 text-3xl font-black">{featuredExam.name}</h3>
          <p className="mt-2 text-muted-foreground">{featuredExam.date}</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-6xl font-black text-blue-400">{featuredExam.daysLeft}</span>
            <span className="pb-2 text-muted-foreground">Days Left</span>
          </div>
          <div className="mt-6">
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, ((120 - featuredExam.daysLeft) / 120) * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {remainingExams.map((exam) => (
            <div key={exam.name} className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-5">
              <div><p className="font-semibold">{exam.name}</p><p className="text-sm text-muted-foreground">{exam.date}</p></div>
              <div className="text-right"><p className="text-xl font-semibold text-blue-400">{exam.daysLeft}</p><p className="text-xs text-muted-foreground">Days</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Account Information */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div><p className="text-sm text-muted-foreground">Name</p><p className="mt-1 text-lg font-semibold">{user.name}</p></div>
          <div><p className="text-sm text-muted-foreground">Email</p><p className="mt-1 text-lg font-semibold">{user.email}</p></div>
          <div><p className="text-sm text-muted-foreground">Role</p><p className="mt-1 text-lg font-semibold">Banking Aspirant</p></div>
        </div>
      </div>

      {/* 6. Preferences */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8">
        <h2 className="text-xl font-semibold mb-6">Preferences</h2>
        <p className="text-sm text-muted-foreground">Notification and theme settings will be managed here.</p>
      </div>

      {/* 7. Danger Zone */}
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6">
        <h2 className="font-semibold text-red-500">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mt-1">These actions permanently affect your account and preparation data.</p>
      </div>
    </div>
  );
}
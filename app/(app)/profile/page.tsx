import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";
import Link from "next/link";
import { getPlannerToday } from "@/lib/planner/planner-date";
import { Trophy, Wallet2 } from "lucide-react";

// Pre-computed exam data with days left
const getUpcomingExams = () => {
  const exams = [
    { name: "SBI PO PRELIMS", date: "2026-08-01" },
    { name: "IBPS PO PRELIMS", date: "2026-08-17" },
    { name: "SBI PO MAINS", date: "2026-09-01" },
    { name: "IBPS PO MAINS", date: "2026-10-12" },
  ];

  const today = getPlannerToday();

  return exams
    .map((exam) => {
      const target = new Date(exam.date);
      target.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return { ...exam, daysLeft };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

const cachedGetUser = cache(async (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  })
);

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await cachedGetUser(session.user.email);
  if (!user) redirect("/login");

  // Fetch running balance details for the account overview card grid
  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
    select: { balance: true },
  });

  const sortedExams = getUpcomingExams();
  const featuredExam = sortedExams[0];
  const remainingExams = sortedExams.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.04] to-transparent" />
        <div className="relative p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            PROFILE
          </span>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                {user.name || "Banking Aspirant"}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">Banking Aspirant</p>
              <div className="mt-4 flex items-center gap-2 text-blue-400 font-medium">
                📍 {featuredExam.name} Target Mode
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">NEXT TARGET</p>
              <p className="mt-1 text-xl font-bold">{featuredExam.name}</p>
              <div className="mt-3 text-6xl font-black tracking-tighter text-blue-400">
                {featuredExam.daysLeft}
              </div>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 text-left hover:border-blue-500/30 transition-all group">
          <div className="mb-3 text-3xl">📅</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">Add Exam</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create new target</p>
        </button>

        <Link
          href="/dashboard"
          className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all group"
        >
          <div className="mb-3 text-3xl">📊</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">Dashboard</h3>
          <p className="mt-1 text-sm text-muted-foreground">View overall progress</p>
        </Link>

        <Link
          href="/settings"
          className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all group"
        >
          <div className="mb-3 text-3xl">⚙️</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">Settings</h3>
          <p className="mt-1 text-sm text-muted-foreground">Account preferences</p>
        </Link>
      </div>

      {/* Synchronized Account Rewards Grid Matrix */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/achievements"
          className="flex items-center justify-between rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/40 transition-all group"
        >
          <div>
            <h3 className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors">
              Achievements
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View milestones and unlocked badges
            </p>
          </div>
          <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
        </Link>

        <Link
          href="/wallet"
          className="flex items-center justify-between rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-emerald-500/40 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reward Wallet
            </p>
            <h3 className="mt-2 text-2xl font-black text-emerald-400 tracking-tight">
              ₹{(wallet?.balance ?? 0).toLocaleString("en-IN")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View wallet & transaction history
            </p>
          </div>
          <Wallet2 className="h-6 w-6 text-emerald-400 shrink-0" />
        </Link>
      </div>

      {/* Current Focus */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Current Focus</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <p className="text-xs text-muted-foreground">EXAM</p>
            <p className="mt-1 font-semibold">SBI PO</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">STAGE</p>
            <p className="mt-1 font-semibold">Prelims</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">DAYS LEFT</p>
            <p className="mt-1 text-2xl font-bold text-blue-400">{featuredExam.daysLeft}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">PRIORITY</p>
            <p className="mt-1 font-semibold">Quantitative Aptitude</p>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Exams</h2>

        {/* Featured Exam */}
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-6 sm:p-8 mb-6">
          <p className="text-xs uppercase tracking-widest text-blue-400">CLOSEST EXAM</p>
          <h3 className="mt-3 text-2xl font-bold">{featuredExam.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{featuredExam.date}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-6xl font-black text-blue-400">{featuredExam.daysLeft}</span>
            <span className="pb-2 text-muted-foreground">days left</span>
          </div>
        </div>

        {/* Remaining Exams */}
        <div className="space-y-4">
          {remainingExams.map((exam) => (
            <div
              key={exam.name}
              className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-semibold">{exam.name}</p>
                <p className="text-sm text-muted-foreground">{exam.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-blue-400">{exam.daysLeft}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-muted-foreground">NAME</p>
            <p className="mt-1 text-lg font-semibold">{user.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">EMAIL</p>
            <p className="mt-1 text-lg font-semibold break-all">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROLE</p>
            <p className="mt-1 text-lg font-semibold">Banking Aspirant</p>
          </div>
        </div>
      </div>

      {/* Preferences & Danger Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <p className="text-sm text-muted-foreground">Notification & theme settings coming soon.</p>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8">
          <h2 className="font-semibold text-red-500">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mt-2">These actions are permanent.</p>
        </div>
      </div>
    </div>
  );
}
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProfileOverview } from "@/lib/profile/queries";
import { HeroSection } from "@/components/profile/profile-hero";
import { ProgressSection } from "@/components/profile/progress-section";
import { ExamCard } from "@/components/profile/exam-card";
import { SettingsCard } from "@/components/profile/settings-card";
import { StreakCard } from "@/components/profile/streak-card";
import { CurrentFocusCard } from "@/components/profile/current-focus-card";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const profile = await getProfileOverview(session.user.email);
  if (!profile) redirect("/login");

  const { user, wallet, activeExam, streak } = profile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Section */}
      <HeroSection user={user} activeExam={activeExam} />

      {/* Preparation */}
      <section aria-labelledby="preparation-section" className="space-y-4">
        <h2
          id="preparation-section"
          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Preparation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ExamCard activeExam={activeExam} />
          <StreakCard streak={streak} />
          <SettingsCard />
        </div>
      </section>

      {/* Progress Section */}
      <ProgressSection wallet={wallet} />

      {/* Focus Section */}
      <CurrentFocusCard activeExam={activeExam} />

      {/* Account Section */}
      <section aria-labelledby="account-section" className="space-y-4">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
          <h2 id="account-section" className="text-xl font-semibold mb-6">
            Account Information
          </h2>
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
      </section>

      {/* Preferences & Security Section */}
      <section aria-labelledby="preferences-security-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 sm:p-8">
            <h2 id="preferences-security-section" className="text-xl font-semibold mb-4">
              Preferences
            </h2>
            <p className="text-sm text-muted-foreground">
              Notification & theme settings coming soon.
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8">
            <h2 className="font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-2">These actions are permanent.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExamProfiles } from "@/lib/exams/queries";

import { HeroSection } from "@/components/exams/hero-section";
import { ActiveExamCard } from "@/components/exams/active-exam-card";
import { ExamProfilesCard } from "@/components/exams/exam-profiles-card";
import { CreateExamSection } from "@/components/exams/create-exam-section";

export default async function ExamsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const exams = await getExamProfiles(session.user.email);
  if (!exams) redirect("/login");

  const { activeExam, daysRemaining, examProfiles } = exams;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* 1. Hero Header */}
      <HeroSection />

      {/* 2. Active Focus Target */}
      <ActiveExamCard
        activeExam={activeExam}
        daysRemaining={daysRemaining}
      />

      {/* 3. Available Exam Profiles */}
      <ExamProfilesCard examProfiles={examProfiles} />

      {/* 4. Create Exam Section */}
      <CreateExamSection />
    </div>
  );
}
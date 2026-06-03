import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/analytics/dashboard-loader";

// Components imported via relative paths to resolve module resolution errors
import { ExamMetrics } from "./exam-metrics";
import { DailyPriorities } from "./daily-priorities";
import { PracticePerformanceSection } from "./practice-performance";

export async function DashboardAnalytics() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return null;

  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-8">
      <ExamMetrics 
        activeExam={data.activeExam} 
        mockStats={data.mocks}
      />
      
      <DailyPriorities priorities={data.priorities} /> 
      
      <PracticePerformanceSection 
        data={data.mocks} 
        studyStats={data.studyAggregate}
      />
    </div>
  );
}
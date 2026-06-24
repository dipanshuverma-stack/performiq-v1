import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { buildMockAnalytics } from "@/lib/mock/mock-analytics";
import MockDashboard from "@/components/mock/MockDashboard";

export default async function MocksPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      mockTests: {
        select: {
          id: true,
          exam: true,
          mockType: true,
          title: true,
          score: true,
          accuracy: true,
          totalQuestions: true,
          createdAt: true,
          subjectPerformances: {
            select: { subject: true, accuracy: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const analytics = buildMockAnalytics(user.mockTests);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mock Tests</h1>
        <p className="text-slate-400 mt-2">Analyze your performance across all mocks</p>
      </div>

      <MockDashboard mocks={user.mockTests} analytics={analytics} />
    </div>
  );
}
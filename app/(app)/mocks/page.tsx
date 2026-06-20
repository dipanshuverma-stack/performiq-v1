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
          id: true, exam: true, mockType: true, title: true, score: true,
          accuracy: true, totalQuestions: true, createdAt: true,
          subjectPerformances: { select: { subject: true, accuracy: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const analytics = buildMockAnalytics(user.mockTests);

  return <MockDashboard mocks={user.mockTests} analytics={analytics} />;
}
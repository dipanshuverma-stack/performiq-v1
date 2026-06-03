import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardAnalytics } from "@/components/dashboard/analytics";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader user={session.user} />
        
        {/* Everything analytical is now streamed */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardAnalytics />
        </Suspense>
      </div>
    </main>
  );
}
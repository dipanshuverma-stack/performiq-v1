import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { TaskWorkspace } from "@/components/tasks/TaskWorkspace";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const userWithTasks = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    },
    select: {
      tasks: {
        orderBy: { 
          createdAt: "desc" 
        },
        select: {
          id: true,
          title: true,
          completed: true,
          createdAt: true,
        },
      },
    },
  });

  if (!userWithTasks) redirect("/login");

  return (
    <PageShell>
      <PageContainer size="wide">
        <PageHeader
          title="Tasks"
          description="Organize your daily study goals and stay consistent."
        />
        <TaskWorkspace tasks={userWithTasks.tasks} />
      </PageContainer>
    </PageShell>
  );
}
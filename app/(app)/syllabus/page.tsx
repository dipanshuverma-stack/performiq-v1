import { auth } from "@/auth";
import { getSyllabusData } from "@/lib/syllabus/getSyllabusData";
import { PageShell } from "@/components/ui/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SyllabusWorkspace } from "@/components/syllabus/SyllabusWorkspace";

export default async function SyllabusPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="text-muted-foreground p-8">Unauthorized</div>;
  }

  const syllabusData = await getSyllabusData(session.user.id);

  return (
    <PageShell>
      <PageContainer size="wide">
        <PageHeader 
          title="Syllabus" 
          description="Track your progress across every banking exam topic." 
        />
        <SyllabusWorkspace data={syllabusData} />
      </PageContainer>
    </PageShell>
  );
}
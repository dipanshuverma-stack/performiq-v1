import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getSyllabusData } from "@/lib/syllabus/getSyllabusData";
import { PageShell } from "@/components/ui/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SyllabusWorkspace } from "@/components/syllabus/SyllabusWorkspace";

const cachedGetSyllabusData = cache(async (userId: string) => 
  getSyllabusData(userId)
);

export default async function SyllabusPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const syllabusData = await cachedGetSyllabusData(session.user.id);

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
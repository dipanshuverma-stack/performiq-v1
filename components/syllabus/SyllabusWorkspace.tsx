"use client";

import { useState } from "react";
import { SyllabusData } from "@/lib/syllabus/getSyllabusData";
import { ProgressCard } from "./ProgressCard";
import { SubjectAccordion } from "./SubjectAccordion";
import { TopicRow } from "./TopicRow";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import { Subject } from "@prisma/client";

interface SyllabusWorkspaceProps {
  data: SyllabusData;
}

export function SyllabusWorkspace({ data }: SyllabusWorkspaceProps) {
  const { progress, subjects } = data;
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState 
        title="Start your preparation" 
        description="Complete your first topic..." 
        icon={BookOpen} 
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Progress - Matches global dashboard aesthetic */}
      <ProgressCard
        completed={progress.completedCount}
        total={progress.totalCount}
        percentage={progress.percentage}
      />

      {/* Tighter grid spacing (gap-5) to match Dashboard rhythm */}
      <div className="grid grid-cols-1 gap-5 pb-20">
        {subjects.map((subject) => (
          <SubjectAccordion
            key={subject.key}
            title={subject.title}
            completed={subject.completedCount}
            total={subject.totalCount}
            isOpen={openSubject === subject.key}
            onToggle={() => setOpenSubject(openSubject === subject.key ? null : subject.key)}
          >
            {/* Topic rows remain flat to preserve subject anchor hierarchy */}
            <div className="pl-4 border-l border-white/5 space-y-2 pt-2">
              {subject.topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  subject={subject.key as Subject}
                  title={topic.name}
                  initialCompleted={topic.completed}
                  estimatedMinutes={topic.estimatedMinutes}
                  weightage={topic.weightage}
                  tags={topic.tags}
                />
              ))}
            </div>
          </SubjectAccordion>
        ))}
      </div>
    </div>
  );
}
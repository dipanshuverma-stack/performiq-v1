"use client";

import { useState } from "react";
import { SyllabusData } from "@/lib/syllabus/getSyllabusData";
import { ProgressCard } from "./ProgressCard";
import { SubjectAccordion } from "./SubjectAccordion";
import { TopicRow } from "./TopicRow";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";

interface SyllabusWorkspaceProps {
  data: SyllabusData;
}

// Map your internal keys to the database ENUM values expected by completeTopic
const SUBJECT_MAP: Record<string, string> = {
  quant: "QUANTITATIVE_APTITUDE",
  reasoning: "REASONING_ABILITY",
  english: "ENGLISH_LANGUAGE",
  ga: "GENERAL_AWARENESS",
  computer: "COMPUTER_AWARENESS",
};

export function SyllabusWorkspace({ data }: SyllabusWorkspaceProps) {
  const { progress, subjects } = data;
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState 
        title="Start your preparation" 
        description="Complete your first topic to see your progress here." 
        icon={BookOpen} 
      />
    );
  }

  return (
    <div className="space-y-8">
      <ProgressCard
        completed={progress.completedCount}
        total={progress.totalCount}
        percentage={progress.percentage}
      />

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
            <div className="pl-4 border-l border-white/5 space-y-2 pt-2">
              {subject.topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  title={topic.name}
                  subject={SUBJECT_MAP[subject.key] || subject.key}
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
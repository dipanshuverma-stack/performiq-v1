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
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Progress Card */}
      <ProgressCard
        completed={progress.completedCount}
        total={progress.totalCount}
        percentage={progress.percentage}
      />

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <SubjectAccordion
            key={subject.key}
            title={subject.title}
            completed={subject.completedCount}
            total={subject.totalCount}
            isOpen={openSubject === subject.key}
            onToggle={() => setOpenSubject(openSubject === subject.key ? null : subject.key)}
          >
            <div className="pl-4 sm:pl-6 border-l border-white/10 space-y-3 pt-4 pb-2">
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
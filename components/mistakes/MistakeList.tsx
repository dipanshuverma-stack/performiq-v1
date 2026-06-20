"use client";

import { useState } from "react";
import { Subject, Difficulty } from "@prisma/client";
import {
  SUBJECT_BY_ID,
  SUBJECT_LOOKUP,
} from "@/lib/constants/subjects";

interface MistakeItem {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  explanation: string;
  resolved: boolean;
  createdAt: Date;
  source: string;
  difficulty: Difficulty;
}

interface ListProps {
  initialMistakes: MistakeItem[];
}

export function MistakeList({ initialMistakes }: ListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper to format date simply
  const formatDate = (dateInput: Date) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section>
      {/* 1. Timeline Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            MISTAKE HISTORY
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-100">
            Logged Mistakes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review every recorded mistake and track your recovery journey.
          </p>
        </div>
      </div>

      {/* 2. Timeline Output */}
      <div className="space-y-4">
        {initialMistakes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#0E121B] py-20 text-center">
            <div className="text-4xl">📚</div>
            <h3 className="mt-4 text-lg font-bold text-zinc-100">
              Your mistake journal is empty.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Log mistakes from practice and mock tests to unlock revision intelligence.
            </p>
            <button className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/[0.08]">
              [ Log First Mistake ]
            </button>
          </div>
        ) : (
          /* Mistake Cards */
          initialMistakes.map((mistake) => {
            const isExpanded = expandedId === mistake.id;
            const subjectId = SUBJECT_LOOKUP[mistake.subject];
            const subMeta = SUBJECT_BY_ID[subjectId];
            const subjectLabel = subMeta ? subMeta.label : mistake.subject;

            return (
              <div
                key={mistake.id}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
              >
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />

                {/* Top Row: Title & Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">
                      {subjectLabel}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mistake.topic}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      mistake.resolved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-orange-500/10 text-orange-400"
                    }`}
                  >
                    {mistake.resolved ? "🟢 Mastered" : "🟠 Pending Review"}
                  </span>
                </div>

                {/* Middle Row: Question Preview */}
                <p className="mt-6 line-clamp-2 text-sm text-zinc-400 leading-relaxed">
                  {mistake.question}
                </p>

                {/* Bottom Row: Metadata & Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDate(mistake.createdAt)}
                  </span>
                  <button
                    onClick={() => toggleAccordion(mistake.id)}
                    className="text-sm font-semibold text-zinc-300 transition-colors hover:text-red-400"
                  >
                    {isExpanded ? "Close ←" : "Review →"}
                  </button>
                </div>

                {/* Expanded Action/Details Area */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-4 animate-in fade-in slide-in-from-top-2">
                    {/* Problem text block */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Target Problem Text
                      </h4>
                      <div className="bg-[#0B1020] border border-white/[0.06] rounded-xl p-4 text-zinc-300 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {mistake.question}
                      </div>
                    </div>

                    {/* Explanation block */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Calibration Breakdown
                      </h4>
                      <p className="text-zinc-400 leading-relaxed text-sm">
                        {mistake.explanation?.trim()
                          ? mistake.explanation
                          : "No calibration explanation logged for this item entry."}
                      </p>
                    </div>

                    {/* Resolution Actions */}
                    <div className="flex justify-end pt-4">
                      {mistake.resolved ? (
                        <button
                          onClick={() => alert(`Re-queue item identification key: ${mistake.id}`)}
                          className="px-4 py-2 text-xs font-bold rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 transition-all"
                        >
                          🔄 Review Again
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Marking resolved item key: ${mistake.id}`)}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20"
                        >
                          Mark as Mastered
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
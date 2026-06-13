"use client";

import { useState } from "react";
import { SUBJECT_MAP, SubjectId } from "@/lib/constants/subjects";
import { Subject } from "@prisma/client"; // ✅ Fix: Imported direct Subject enum keys to resolve build blocker

interface MistakeItem {
  id: string;
  subject: Subject; // ✅ Now fully typed and recognized by the compiler
  topic: string;
  question: string;
  explanation: string | null; 
  resolved: boolean;
  createdAt: Date;
  source?: string | null;
  difficulty?: any;           
  confidenceScore?: any;
  notes?: string | null;
}

interface ListProps {
  initialMistakes: MistakeItem[];
}

export function MistakeList({ initialMistakes }: ListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="border border-white/[0.06] bg-[#0B0F19] rounded-xl shadow-xl divide-y divide-white/[0.06] overflow-hidden">
      {initialMistakes.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500 font-medium">
          No entries found matching criteria constraints.
        </div>
      ) : (
        initialMistakes.map((mistake) => {
          const isExpanded = expandedId === mistake.id;
          const subMeta = SUBJECT_MAP[mistake.subject as SubjectId];

          return (
            <div key={mistake.id} className="transition-colors duration-150 hover:bg-white/[0.01]">
              {/* Row Trigger Header Bar */}
              <button
                onClick={() => toggleAccordion(mistake.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 font-medium text-sm text-slate-300 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-slate-600 font-mono text-xs w-4">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  
                  {subMeta && (
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 border"
                      style={{
                        backgroundColor: `var(--${subMeta.color}-500-opacity-10, rgba(99, 102, 241, 0.1))`,
                        color: `var(--${subMeta.color}-400, #818cf8)`, 
                        borderColor: `var(--${subMeta.color}-500-opacity-20, rgba(99, 102, 241, 0.2))`,
                      }}
                    >
                      {subMeta.icon} {subMeta.id}
                    </span>
                  )}
                  
                  <span className="font-extrabold text-white truncate">
                    {mistake.topic}
                  </span>
                  
                  <span className="text-slate-500 text-xs hidden md:inline truncate font-normal">
                    — {mistake.question.substring(0, 75)}...
                  </span>
                </div>
                
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`text-[10px] tracking-wider font-black uppercase px-2 py-0.5 rounded-full border ${
                    mistake.resolved 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {mistake.resolved ? "Mastered" : "Revision"}
                  </span>
                </div>
              </button>

              {/* Collapsible Content Area */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t border-dashed border-white/[0.06] bg-[#090D16]/40 text-sm space-y-4">
                  
                  {/* Problem text block */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Problem Text</h4>
                    <div className="bg-[#090D16] border border-white/[0.06] rounded-xl p-3.5 text-slate-300 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap selection:bg-indigo-500/30">
                      {mistake.question}
                    </div>
                  </div>

                  {/* Explanation block */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calibration Breakdown</h4>
                    <p className="text-slate-300 leading-relaxed text-xs pl-0.5">
                      {mistake.explanation?.trim() ? mistake.explanation : "No calibration explanation logged for this item entry."}
                    </p>
                  </div>

                  {/* Personal Annotations Area */}
                  {mistake.notes && (
                    <div className="border-l-2 border-indigo-500 pl-3 py-1 text-xs text-slate-400 italic bg-indigo-500/[0.03] pr-2 rounded-r-lg">
                      <span className="font-bold text-indigo-400 not-italic block mb-0.5 text-[10px] uppercase tracking-wider">Personal Annotations:</span>
                      {mistake.notes}
                    </div>
                  )}

                  {/* Action Layout Interface Segments */}
                  <div className="flex justify-end pt-2 gap-2">
                    {mistake.resolved ? (
                      <button 
                        onClick={() => alert(`Re-queue item identification key: ${mistake.id}`)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 transition-all shadow-sm cursor-pointer"
                      >
                        🔄 Review Again
                      </button>
                    ) : (
                      <button 
                        onClick={() => alert(`Marking resolved item key: ${mistake.id}`)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
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
  );
}
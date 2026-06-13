import React, { useState, useMemo } from "react";
import { syllabus } from "@/config/syllabus";
import { ALLOWED_SUBJECTS } from "@/components/practice/core/constants";
import { PracticeDifficulty } from "@/components/practice/core/types";

interface PracticeSetupProps {
  subject: keyof typeof syllabus;
  setSubject: (sub: keyof typeof syllabus) => void;
  topic: string;
  setTopic: (topic: string) => void;
  difficulty: PracticeDifficulty;
  setDifficulty: (diff: PracticeDifficulty) => void;
  onStart: () => void;
}

export function PracticeSetup({
  subject, setSubject, topic, setTopic, difficulty, setDifficulty, onStart
}: PracticeSetupProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTopics = useMemo(() => {
    const currentPool = syllabus[subject] || [];
    if (!search.trim()) return currentPool;
    return currentPool.filter((t) => t.toLowerCase().includes(search.toLowerCase()));
  }, [subject, search]);

  return (
    <div className="bg-[#141b2d] border border-[#1e2640] rounded-2xl p-5 space-y-4 shadow-xl text-zinc-100">
      <div>
        <h2 className="text-sm font-black text-white uppercase tracking-wider">Configure Practice Session</h2>
        <p className="text-[10px] text-zinc-400 font-medium font-mono">Select parameters to initialize your runtime environment.</p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Subject</label>
          <div className="grid grid-cols-2 gap-2">
            {ALLOWED_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => { setSubject(sub); setTopic(syllabus[sub]?.[0] || ""); }}
                className={`py-2 px-3 text-xs font-bold border rounded-xl transition-all ${
                  subject === sub 
                    ? "bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-indigo-950/50" 
                    : "bg-[#0d121f] border-[#1e2640] text-zinc-400 hover:border-[#2e3a5f]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Topic Selector</label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#0d121f] border border-[#1e2640] text-xs rounded-xl px-3 py-2 text-zinc-200 font-semibold text-left flex justify-between items-center h-9"
          >
            <span className="truncate">{topic || "Search and select a topic..."}</span>
            <span className="text-zinc-500 text-[10px]">▼</span>
          </button>

          {isOpen && (
            <div className="absolute z-30 mt-1.5 w-full bg-[#141b2d] border border-[#1e2640] rounded-xl shadow-2xl overflow-hidden p-1.5 space-y-1">
              <input
                type="text"
                placeholder="Type to filter topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0d121f] border border-[#1e2640] text-xs rounded-lg px-2.5 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#2e3a5f]"
              />
              <div className="max-h-48 overflow-y-auto pt-1">
                {filteredTopics.length === 0 ? (
                  <div className="text-[11px] text-zinc-500 p-2 text-center">No matching operational topics found</div>
                ) : (
                  filteredTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setTopic(t); setIsOpen(false); setSearch(""); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        topic === t ? "bg-[#4f46e5] text-white font-bold" : "text-zinc-400 hover:bg-[#0d121f] hover:text-zinc-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Difficulty Profile</label>
          <div className="grid grid-cols-3 gap-2">
            {(["Easy", "Mixed ⭐", "Mains"] as PracticeDifficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2 px-1 text-xs font-bold border rounded-xl transition-all ${
                  difficulty === diff 
                    ? "bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-indigo-950/50" 
                    : "bg-[#0d121f] border-[#1e2640] text-zinc-400 hover:border-[#2e3a5f]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider mt-2 shadow-lg shadow-emerald-950/20"
      >
        ▶ Start Practice Session
      </button>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { syllabus } from "@/config/syllabus";
import { ALLOWED_SUBJECTS } from "@/components/practice/core/constants";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { PracticeDifficulty } from "@/lib/practice/types";
import { PRACTICE_DIFFICULTY_LABELS } from "@/config/practice";
import { GlassCard } from "@/components/ui/glass-card";

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
  subject,
  setSubject,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  onStart,
}: PracticeSetupProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const filteredTopics = useMemo(() => {
    const currentPool = syllabus[subject] || [];
    if (!search.trim()) return currentPool;
    return currentPool.filter((t) => t.toLowerCase().includes(search.toLowerCase()));
  }, [subject, search]);

  return (
    <GlassCard className="p-5 md:p-8 rounded-3xl flex flex-col h-full">
      {/* Premium Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Configure Practice Session
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400 max-w-xl">
          Create a focused practice workspace by selecting a subject, topic and
          difficulty level before starting your session.
        </p>
      </div>

      <div className="space-y-8 pt-4 flex-1">
        {/* Subject Grid */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Subject
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALLOWED_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setSubject(sub);
                  setTopic(syllabus[sub]?.[0] ?? "");
                  setSearch("");
                  setIsOpen(false);
                }}
                className={cn(
                  "h-14 px-4 text-sm font-semibold border rounded-2xl transition-all duration-300",
                  subject === sub
                    ? "bg-primary/15 border-primary/30 text-primary shadow-lg shadow-primary/10"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:border-primary/20"
                )}
              >
                {SUBJECT_LABELS[sub] ?? sub}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selector */}
        <div className="relative" ref={wrapperRef}>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Topic Selector
          </label>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setIsOpen((prev) => !prev);
            }}
            className="w-full h-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 text-left text-sm text-white hover:border-primary/20 transition-all flex items-center justify-between"
          >
            <span className="truncate">{topic || "Search and select a topic..."}</span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>

          {isOpen && (
            <div className="absolute z-30 mt-1.5 w-full bg-background/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden p-1.5 space-y-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to filter topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary"
              />
              <div className="max-h-60 overflow-y-auto pt-1">
                {filteredTopics.length === 0 ? (
                  <div className="text-[11px] text-slate-400 p-3 text-center">No matching topics found</div>
                ) : (
                  filteredTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={cn("w-full text-left px-3 py-3 rounded-xl text-sm transition-colors", topic === t ? "bg-primary/10 text-primary font-semibold" : "text-slate-400 hover:bg-white/[0.04] hover:text-white")}
                    >
                      {t}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Grid */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Difficulty Profile
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(PRACTICE_DIFFICULTY_LABELS) as PracticeDifficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={cn(
                  "h-14 px-4 text-sm font-semibold border rounded-2xl transition-all duration-300",
                  difficulty === diff
                    ? "bg-primary/15 border-primary/30 text-primary shadow-lg shadow-primary/10"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:border-primary/20"
                )}
              >
                {PRACTICE_DIFFICULTY_LABELS[diff]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Summary Strip */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 mt-8 mb-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-slate-500">Subject</p>
            <p className="text-sm font-semibold truncate">{SUBJECT_LABELS[subject]}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Topic</p>
            <p className="text-sm font-semibold truncate">{topic}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Difficulty</p>
            <p className="text-sm font-semibold truncate">{PRACTICE_DIFFICULTY_LABELS[difficulty]}</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="border-t border-white/[0.06] pt-6 mt-auto">
        <button
          onClick={onStart}
          disabled={!topic}
          className={cn(
            "w-full h-14 font-bold rounded-2xl text-sm tracking-[0.15em] transition-all duration-300 shadow-lg",
            !topic
              ? "bg-neutral-700 text-neutral-400 opacity-50 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] shadow-blue-500/20 hover:shadow-blue-500/30 text-white"
          )}
        >
          START PRACTICE SESSION →
        </button>
      </div>
    </GlassCard>
  );
}
"use client";

import { useEffect, useRef } from "react";
import { Subject, Difficulty, RevisionStatus } from "@prisma/client";
import { CONFIDENCE_LEVELS } from "@/lib/constants/practice";
import { SUBJECT_LABELS } from "@/config/syllabus";

interface DrawerSession {
  id: string;
  subject: Subject;
  topic: string;
  accuracy: number;
  qpm: number;
  durationSeconds: number;
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  difficulty?: Difficulty | null;
  confidenceScore?: number | null;
  revisionStatus?: RevisionStatus | null;
  notes?: string | null;
}

interface DrawerProps {
  session: DrawerSession | null;
  onClose: () => void;
}

export function SessionDetailDrawer({ session, onClose }: DrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!session) return;
    function handleKeyDown(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [session, onClose]);

  if (!session) return null;

  const confidence = session.confidenceScore 
    ? CONFIDENCE_LEVELS[session.confidenceScore as keyof typeof CONFIDENCE_LEVELS] 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl border-l border-gray-100 flex flex-col justify-between transition-all duration-300">
            
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">
                    {SUBJECT_LABELS[session.subject]}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">{session.topic}</h2>
                </div>
                <button 
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {/* Primary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">Accuracy</span>
                  <strong className="text-xl font-bold text-slate-800">{session.accuracy}%</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">Velocity</span>
                  <strong className="text-xl font-bold text-slate-800">{session.qpm.toFixed(2)} QPM</strong>
                </div>
              </div>

              {/* Response Segmentation */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Segmentation</h4>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-center text-emerald-600">
                    🟢 <strong className="font-bold">{session.correctQuestions}</strong> Correct
                  </div>
                  <div className="flex-1 rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-center text-rose-600">
                    ❌ <strong className="font-bold">{session.incorrectQuestions}</strong> Incorrect
                  </div>
                </div>
              </div>

              {/* Metadata & Tracking */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Metadata</h4>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Complexity</span>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase">
                    {session.difficulty || "MEDIUM"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Confidence</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${confidence?.color ?? "bg-gray-50 text-gray-600"}`}>
                    {confidence?.label ?? "Normal"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Revision Track</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    session.revisionStatus === "MASTERED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    session.revisionStatus === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {session.revisionStatus === "MASTERED" ? "Mastered" : 
                     session.revisionStatus === "IN_PROGRESS" ? "In Progress" : "❌ Weak"}
                  </span>
                </div>
              </div>

              {/* Performance Observations */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Observations</h4>
                <div className="bg-slate-50 p-4 rounded-xl text-xs leading-relaxed text-slate-600 italic border border-slate-100 whitespace-pre-wrap">
                  {session.notes && session.notes.trim().length > 0
                    ? session.notes
                    : "No customized analytical observation logs appended to this run session."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50/50">
              <button onClick={onClose} className="w-full text-xs font-bold py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
                Close Metrics View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
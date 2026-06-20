"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Subject, Difficulty, RevisionStatus } from "@prisma/client";
import { CONFIDENCE_LEVELS } from "@/lib/constants/practice";
import { SUBJECT_LABELS } from "@/config/syllabus";
import { updatePracticeSessionNotes } from "@/app/(app)/practice/history/actions";
import { deletePracticeSession } from "@/app/(app)/practice/history/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(session?.notes ?? "");

  // ✅ 1. Added dynamic dirty state tracking for live buffer alterations
  const hasUnsavedChanges = notes.trim() !== (session?.notes ?? "").trim();

  useEffect(() => {
    if (session) {
      setNotes(session.notes ?? "");
      setEditingNotes(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    
    // ✅ 3. Updated Escape key keydown event listener with confirm dialogue guards
    function handleKeyDown(e: KeyboardEvent) { 
      if (e.key !== "Escape") return;
      if (deleteOpen) return;

      if (
        editingNotes &&
        hasUnsavedChanges &&
        !window.confirm("You have unsaved notes. Discard changes?")
      ) {
        return;
      }

      onClose(); 
    }
    
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [session, onClose, deleteOpen, editingNotes, hasUnsavedChanges]);

  if (!session) return null;

  async function handleSaveNotes() {
    if (!session) return;

    startTransition(async () => {
      try {
        await updatePracticeSessionNotes(
          session.id,
          notes.trim()
        );
        setEditingNotes(false);
      } catch (error) {
        console.error("Failed to update session observations:", error);
      }
    });
  }

  const confidence = session.confidenceScore 
    ? CONFIDENCE_LEVELS[session.confidenceScore as keyof typeof CONFIDENCE_LEVELS] 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* ✅ 2. Updated backdrop click event with confirmation interceptors */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
          onClick={() => {
            if (deleteOpen) return;

            if (
              editingNotes &&
              hasUnsavedChanges &&
              !window.confirm("You have unsaved notes. Discard changes?")
            ) {
              return;
            }

            onClose();
          }} 
        />
        
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
                {/* ✅ 4. Updated top frame close button execution logic */}
                <button 
                  ref={closeButtonRef}
                  onClick={() => {
                    if (
                      editingNotes &&
                      hasUnsavedChanges &&
                      !window.confirm("You have unsaved notes. Discard changes?")
                    ) {
                      return;
                    }

                    onClose();
                  }}
                  disabled={isPending || deleteOpen}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-sm disabled:opacity-50"
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
                <div className="space-y-3">
                  {editingNotes ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      disabled={isPending}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      placeholder="Write your observations..."
                    />
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl text-xs leading-relaxed text-slate-600 italic border border-slate-100 whitespace-pre-wrap">
                      {notes.trim().length > 0
                        ? notes
                        : "No customized analytical observation logs appended to this run session."}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!editingNotes ? (
                      <button
                        type="button"
                        onClick={() => setEditingNotes(true)}
                        disabled={isPending || deleteOpen}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                      >
                        Edit Notes
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setNotes(session.notes ?? "");
                            setEditingNotes(false);
                          }}
                          disabled={isPending}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveNotes}
                          disabled={isPending}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isPending ? "Saving..." : "Save"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Block Footer */}
            <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center gap-3">
              
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={isPending || editingNotes}
                    className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all text-center"
                  >
                    Delete Session
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Practice Session?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this practice session and update all
                      analytics, streaks and performance metrics. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition(async () => {
                          try {
                            await deletePracticeSession(session.id);
                            setDeleteOpen(false);
                            onClose();
                          } catch (error) {
                            console.error("Friction layer mutation failure:", error);
                          }
                        });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                      disabled={isPending}
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* ✅ 5. Updated footer frame close button execution logic */}
              <button 
                type="button"
                onClick={() => {
                  if (
                    editingNotes &&
                    hasUnsavedChanges &&
                    !window.confirm("You have unsaved notes. Discard changes?")
                  ) {
                    return;
                  }

                  onClose();
                }}
                disabled={isPending || deleteOpen}
                className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 transition-all text-center disabled:opacity-50"
              >
                Close Metrics View
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
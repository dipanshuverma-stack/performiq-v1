"use client";

import { useState } from "react";
import { toggleTask, deleteTask } from "@/app/actions/task";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { Check, Trash2, Loader2 } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskCard({ id, title, completed }: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMutating = isToggling || isDeleting;

  const handleToggle = async () => {
    if (isMutating) return;
    setIsToggling(true);
    try {
      await toggleTask(id);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isMutating) return;
    setIsDeleting(true);
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <GlassCard
      className={cn(
        "group relative px-6 py-5 rounded-2xl transition-all duration-300 border overflow-hidden select-none",
        "hover:-translate-y-px hover:border-white/[0.12] hover:bg-white/[0.02] hover:shadow-xl hover:shadow-indigo-500/5",
        completed
          ? "border-emerald-500/10 bg-emerald-500/[0.03] opacity-80"
          : "border-white/[0.05] bg-[#0C111B]",
        isMutating && "opacity-70"
      )}
    >
      {/* Left Accent Bar */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-200",
          completed
            ? "bg-emerald-500"
            : "bg-transparent group-hover:bg-indigo-500/60"
        )}
      />

      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Left Control Zone */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            disabled={isMutating}
            aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
            className={cn(
              "w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer",
              "transition-all duration-200 hover:border-indigo-400 hover:scale-105 active:scale-95",
              completed
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-white/[0.12] bg-black/20"
            )}
          >
            {isToggling ? (
              <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
            ) : (
              completed && <Check className="h-3.5 w-3.5 stroke-[3]" />
            )}
          </button>

          <p
            className={cn(
              "font-medium text-sm transition-colors duration-200 truncate pr-6 select-none",
              completed ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200"
            )}
            title={title}
          >
            {title}
          </p>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-4 shrink-0">
          {!completed && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border bg-indigo-500/5 border-indigo-500/10 text-indigo-400">
              Today
            </span>
          )}

          <button
            onClick={handleDelete}
            disabled={isMutating}
            aria-label="Delete task"
            className="
              p-2 rounded-lg text-slate-500 
              hover:text-rose-400 hover:bg-rose-500/10
              transition-all duration-200 
              hover:scale-110 active:scale-95
              opacity-100 md:opacity-50 md:hover:opacity-100
            "
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock3, ChevronRight, Check } from "lucide-react";
import { completeTopic } from "@/app/actions/topic-progress";

interface TopicRowProps {
  title: string;
  subject: string;
  initialCompleted: boolean;
  estimatedMinutes?: number;
  weightage?: "HIGH" | "MEDIUM" | "LOW";
  tags?: string[];
}

export function TopicRow({
  title,
  subject,
  initialCompleted,
  estimatedMinutes,
  weightage,
  tags = [],
}: TopicRowProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, setIsPending] = useState(false);

  async function handleToggle() {
    setIsPending(true);
    const nextValue = !isCompleted;
    setIsCompleted(nextValue);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("topic", title);

    try {
      await completeTopic(formData);
    } catch (error) {
      console.error("Failed to update progress", error);
      setIsCompleted(!nextValue); // Revert on error
    } finally {
      setIsPending(false);
    }
  }

  const weightageStyles = {
    HIGH: "rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300",
    MEDIUM: "rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300",
    LOW: "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-400",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "group w-full flex items-center justify-between rounded-2xl px-6 py-5 bg-[#0C111B] border transition-all duration-300",
        isCompleted 
          ? "border-emerald-500/15 bg-emerald-500/5" 
          : "border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.12] hover:-translate-y-[2px] hover:shadow-lg hover:shadow-indigo-500/5"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-7 h-7 rounded-xl border flex items-center justify-center transition-all",
          isCompleted 
            ? "bg-emerald-500 border-emerald-500 text-white" 
            : "border-white/[0.08] bg-black/20 group-hover:border-indigo-400"
        )}>
          {isCompleted && <Check className="h-4 w-4" />}
        </div>
        
        <div className="text-left">
          <h3 className={cn("text-lg font-semibold transition-colors", isCompleted ? "text-emerald-500" : "text-white")}>
            {title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {weightage && (
          <span className={isCompleted ? "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300" : weightageStyles[weightage]}>
            {isCompleted ? "Completed" : weightage}
          </span>
        )}
        {estimatedMinutes && (
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-slate-300">
            <Clock3 className="h-3 w-3 text-slate-400" />
            {estimatedMinutes}m
          </span>
        )}
        <ChevronRight className={cn("h-5 w-5 transition-all", isCompleted ? "text-emerald-500/50" : "text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400")} />
      </div>
    </button>
  );
}
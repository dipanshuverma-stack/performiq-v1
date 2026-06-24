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
      setIsCompleted(!nextValue);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "group w-full flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl px-5 sm:px-6 py-5 bg-[#0C111B] border transition-all duration-300 text-left",
        isCompleted 
          ? "border-emerald-500/20 bg-emerald-500/5" 
          : "border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.12]"
      )}
    >
      <div className="flex items-start gap-4 w-full">
        {/* Checkbox */}
        <div className={cn(
          "w-7 h-7 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
          isCompleted 
            ? "bg-emerald-500 border-emerald-500 text-white" 
            : "border-white/[0.08] bg-black/20 group-hover:border-indigo-400"
        )}>
          {isCompleted && <Check className="h-4 w-4" />}
        </div>

        {/* Title + Tags */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-[15px] sm:text-lg font-semibold leading-tight break-words",
            isCompleted ? "text-emerald-500" : "text-white"
          )}>
            {title}
          </h3>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="rounded-md border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Info */}
      <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
        {weightage && (
          <span className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold whitespace-nowrap",
            isCompleted 
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" 
              : "border-white/[0.08] bg-white/[0.05] text-slate-300"
          )}>
            {isCompleted ? "Completed" : weightage}
          </span>
        )}

        {estimatedMinutes && (
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-slate-300 whitespace-nowrap">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            {estimatedMinutes}m
          </span>
        )}

        <ChevronRight className={cn(
          "h-5 w-5 transition-all flex-shrink-0",
          isCompleted ? "text-emerald-500/50" : "text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400"
        )} />
      </div>
    </button>
  );
}
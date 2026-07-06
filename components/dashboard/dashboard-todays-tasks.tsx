"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleTaskCompletion } from "@/app/actions/planner";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";
import { Check, Loader2, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodayTask {
  id: string;
  title: string;
  time: string | null;
  completed: boolean;
}

interface DashboardTodaysTasksProps {
  tasks: TodayTask[];
}

export function DashboardTodaysTasks({ tasks }: DashboardTodaysTasksProps) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const total = tasks.length;
  const completed = tasks.reduce(
    (count, task) => count + (task.completed ? 1 : 0),
    0
  );

  const handleToggle = (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      try {
        await toggleTaskCompletion(id);
      } finally {
        setLoadingId(null);
      }
    });
  };

  return (
    <section className="space-y-3 mt-6">
      <SectionHeader title="Today's Tasks" />

      <GlassCard className="p-4">
        {total === 0 ? (
          <div className="py-6 text-center">
            <CalendarDays className="mx-auto h-6 w-6 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-200">Nothing planned today</h3>
            <Link href="/tasks">
              <ActionButton size="sm" className="mt-3">Open Planner</ActionButton>
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Today's Goals</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{completed} of {total} completed</p>
              </div>
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1">
                <p className="text-sm font-bold text-indigo-400">{completed} / {total}</p>
              </div>
            </div>

            {/* Tasks */}
            <div className="mt-3 space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      disabled={isPending}
                      onClick={() => handleToggle(task.id)}
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                        task.completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-white/10 bg-black/20 hover:border-indigo-400"
                      )}
                    >
                      {loadingId === task.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        task.completed && <Check className="h-3 w-3 stroke-[3]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={cn("truncate text-xs font-medium", task.completed ? "text-slate-500 line-through" : "text-slate-200")}>
                        {task.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-end border-t border-white/[0.06] pt-3">
              <Link href="/tasks">
                <ActionButton variant="secondary" size="sm" className="gap-1.5 text-xs">
                  Open Planner <ArrowRight className="h-3 w-3" />
                </ActionButton>
              </Link>
            </div>
          </>
        )}
      </GlassCard>
    </section>
  );
}
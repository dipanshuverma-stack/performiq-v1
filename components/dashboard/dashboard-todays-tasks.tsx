"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleTaskCompletion } from "@/app/actions/planner";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ActionButton } from "@/components/ui/action-button";
import { Check, Loader2, CalendarDays, ArrowRight, Clock } from "lucide-react";
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

  // Step 13.1: Calculate mission critical variables
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const completion =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

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
    <section className="space-y-4 mt-6">
      <SectionHeader title="Today's Mission" />

      {/* Step 13.2: Render rich mission container */}
      <GlassCard className="p-6">
        {totalTasks === 0 ? (
          <div className="py-8 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">No mission files loaded</h3>
            <p className="text-xs text-slate-500 mt-1">Schedule your tasks in the daily planner to begin tracking.</p>
            <Link href="/tasks">
              <ActionButton size="sm" className="mt-4">Open Planner</ActionButton>
            </Link>
          </div>
        ) : (
          <>
            {/* Mission Identity Block */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  TODAY'S MISSION
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Complete today's planned work
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Finish your planner tasks to maximize today's XP.
                </p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-black text-white tracking-tight">
                  {completion}%
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Completed
                </p>
              </div>
            </div>

            {/* Step 13.3: Visual Progress Metrics Section */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  {completedTasks} completed
                </span>
                <span>
                  {remainingTasks} remaining
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>

            {/* Tasks / Mission Directives */}
            <div className="mt-6 space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 transition-all",
                    task.completed 
                      ? "border-emerald-500/20 bg-emerald-500/[0.01] opacity-75" 
                      : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1]"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      disabled={isPending}
                      onClick={() => handleToggle(task.id)}
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200",
                        task.completed
                          ? "border-emerald-500 bg-emerald-500 text-black font-black"
                          : "border-white/20 bg-black/40 hover:border-indigo-400"
                      )}
                    >
                      {loadingId === task.id ? (
                        <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                      ) : (
                        task.completed && <Check className="h-3 w-3 stroke-[3.5]" />
                      )}
                    </button>
                    
                    <div className="min-w-0 space-y-0.5">
                      <p className={cn(
                        "text-xs font-semibold tracking-wide transition-all", 
                        task.completed ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200"
                      )}>
                        {task.title}
                      </p>
                      {task.time && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{task.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-Analytics Section Summary */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center font-mono">
              <div className="bg-black/20 border border-white/[0.04] p-2 rounded-md">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
                <div className="text-sm font-bold text-slate-300 mt-0.5">{totalTasks}</div>
              </div>
              <div className="bg-black/20 border border-white/[0.04] p-2 rounded-md">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Remaining</div>
                <div className="text-sm font-bold text-purple-400 mt-0.5">{remainingTasks}</div>
              </div>
              <div className="bg-black/20 border border-white/[0.04] p-2 rounded-md">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Efficiency</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">{completion}%</div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="mt-4 flex justify-end">
              <Link href="/tasks">
                <ActionButton variant="secondary" size="sm" className="gap-1.5 text-xs">
                  Modify Timeline <ArrowRight className="h-3 w-3" />
                </ActionButton>
              </Link>
            </div>
          </>
        )}
      </GlassCard>
    </section>
  );
}
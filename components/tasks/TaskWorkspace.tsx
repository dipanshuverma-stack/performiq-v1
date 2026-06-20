"use client";

import { TaskHero } from "./TaskHero";
import { TaskInput } from "./TaskInput";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Target, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskWorkspaceProps {
  tasks: Task[];
}

export function TaskWorkspace({ tasks }: TaskWorkspaceProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-10">
      <TaskHero
        total={total}
        completed={completed}
        pending={pending}
        percentage={percentage}
      />

      <TaskInput />

      {total === 0 ? (
        <div className="py-16 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
          <EmptyState
            title="No study goals yet"
            description="Create your first task to organize today's preparation."
            icon={Target}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Information Strip */}
          <div className="border-b border-white/[0.05] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
                Today's Tasks
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {pending} Active Study Goal{pending !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 tracking-wide">
              <div className="flex items-center gap-1.5 text-emerald-400/90">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{completed} Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400/90">
                <span className="inline-block w-2 h-2 rounded-full border border-indigo-400/60 bg-indigo-500/10" />
                <span>{pending} Pending</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            {/* Active Study Goals */}
            {pendingTasks.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {pendingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    completed={false}
                  />
                ))}
              </div>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-emerald-400/60 tracking-wider uppercase">
                  Completed Today
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      completed={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
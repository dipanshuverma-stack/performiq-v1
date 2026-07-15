"use client";

import { Trash2, GripVertical, Info, Clock3 } from "lucide-react";
import { OptimisticTask } from "@/lib/planner/types";
import { PlannerTooltip } from "./planner-tooltip";
import { cn } from "@/lib/utils";

interface PlannerTaskCardProps {
  task: OptimisticTask;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: OptimisticTask) => void;
}

export function PlannerTaskCard({
  task,
  onToggleComplete,
  onDelete,
  onDragStart,
}: PlannerTaskCardProps) {
  return (
    <div
      draggable={!task.isOptimistic}
      onDragStart={(e) => onDragStart(e, task)}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "group w-full min-h-[88px] rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.025] px-3 py-3 relative hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between",
        task.completed && "opacity-70",
        task.isOptimistic && "animate-pulse border-dashed border-blue-500/40 bg-blue-500/[0.02]"
      )}
    >
      <div className="flex gap-2.5 items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, task.completed)}
          disabled={task.isOptimistic}
          aria-label={`Mark "${task.title}" as complete`}
          className="mt-1 h-5 w-5 flex-shrink-0 accent-blue-600 rounded-md cursor-pointer disabled:opacity-50"
        />

        {/* pr-8 provides optimal whitespace allocation while keeping hover controls easily reachable */}
        <div className="flex-1 min-w-0 pr-8">
          <div
            className={cn(
              "text-[15px] font-semibold leading-tight text-white line-clamp-2 break-normal overflow-hidden",
              task.completed && "line-through text-slate-400"
            )}
            title={task.title}
          >
            {task.title}
          </div>

          <div className="mt-2 space-y-2">
            {task.time && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock3 className="h-3 w-3" />
                <span>{task.time}</span>
              </div>
            )}

            {task.carryForward && (
              <PlannerTooltip content="This task was carried over because it wasn't completed on its original scheduled day.">
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300 hover:text-amber-200 transition-colors cursor-help">
                  <span>Continued</span>
                  <Info className="h-3 w-3 opacity-60" />
                </div>
              </PlannerTooltip>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:block opacity-0 group-hover:opacity-100 absolute top-3.5 right-8 flex-shrink-0 transition-opacity">
        <GripVertical className="h-4 w-4 text-slate-500" />
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.title}"`}
        className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 absolute top-2.5 right-2 p-1 text-rose-400 hover:text-rose-300 transition-all duration-150"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
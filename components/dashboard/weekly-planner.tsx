"use client";

import { useState, useTransition, useOptimistic, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical, CornerDownRight } from "lucide-react";
import { addWeeklyPlanTask, deleteWeeklyPlanTask, updatePlannerRows, updateTaskPosition, toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";

type PlannerTask = {
  id: string;
  plannedDate: Date | string; // Handled safely as both Date or String after hydration
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
  carryForward: boolean;
  carryForwardDays: number;
};

type OptimisticTask = PlannerTask & { isOptimistic?: boolean };

// Safe timezone helper to match tasks with columns uniformly
function formatDateKey(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPlannerDays() {
  const today = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    let label = date.toLocaleDateString("en-GB", { weekday: "short" });
    if (index === 0) label = "Today";
    if (index === 1) label = "Tomorrow";

    return { label, date, isToday: index === 0 };
  });
}

export function WeeklyPlanner({
  plannerTasks: initialTasks,
  initialRows,
}: {
  plannerTasks: PlannerTask[];
  initialRows: number;
}) {
  const [rows, setRows] = useState(initialRows);
  const [selectedCell, setSelectedCell] = useState<{ date: Date; row: number } | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, action: { type: string; payload: any }) => {
      switch (action.type) {
        case "ADD":
          return [...state, { ...action.payload, isOptimistic: true }];
        case "DELETE":
          return state.filter((task) => task.id !== action.payload.id);
        case "TOGGLE":
          return state.map((task) =>
            task.id === action.payload.id 
              ? { 
                  ...task, 
                  completed: action.payload.completed,
                  ...(action.payload.completed && { carryForward: false, carryForwardDays: 0 })
                } 
              : task
          );
        case "MOVE":
          return state.map((task) =>
            task.id === action.payload.id
              ? {
                  ...task,
                  plannedDate: action.payload.plannedDate,
                  rowIndex: action.payload.rowIndex,
                  carryForward: false,
                  carryForwardDays: 0,
                }
              : task
          );
        default:
          return state;
      }
    }
  );

  const taskMap = useMemo(() => {
    return optimisticTasks.reduce((acc, task) => {
      if (!task.plannedDate) return acc;
      const dateString = formatDateKey(task.plannedDate);
      const key = `${dateString}-${task.rowIndex}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, OptimisticTask[]>);
  }, [optimisticTasks]);

  const plannerDays = useMemo(() => getPlannerDays(), []);

  const handleRowChange = (newRows: number) => {
    const previousRows = rows;
    setRows(newRows);
    startTransition(async () => {
      try {
        await updatePlannerRows(newRows);
        router.refresh();
      } catch {
        setRows(previousRows);
      }
    });
  };

  const resetAddForm = useCallback(() => {
    setTitle("");
    setTime("");
    setSelectedCell(null);
  }, []);

  const handleAddTask = () => {
    if (!title.trim() || !selectedCell) return;

    const newTask: OptimisticTask = {
      id: `temp-${Date.now()}`,
      plannedDate: selectedCell.date,
      rowIndex: selectedCell.row,
      title: title.trim(),
      time: time.trim() || null,
      completed: false,
      carryForward: false,
      carryForwardDays: 0,
      isOptimistic: true,
    };

    startTransition(async () => {
      setOptimisticTasks({ type: "ADD", payload: newTask });
      resetAddForm();
      try {
        await addWeeklyPlanTask({
          plannedDate: selectedCell.date.toISOString(),
          rowIndex: selectedCell.row,
          title: newTask.title,
          time: newTask.time || undefined,
        });
        router.refresh();
      } catch {
        router.refresh();
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      setOptimisticTasks({ type: "DELETE", payload: { id: taskId } });
      try {
        await deleteWeeklyPlanTask(taskId);
      } catch {
        router.refresh();
      }
    });
  };

  const handleToggleComplete = (taskId: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    startTransition(async () => {
      setOptimisticTasks({ type: "TOGGLE", payload: { id: taskId, completed: newCompleted } });
      try {
        await toggleTaskCompletion(taskId);
      } catch {
        router.refresh();
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, task: OptimisticTask) => {
    if (task.isOptimistic || !task.plannedDate) return;
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromDate", new Date(task.plannedDate).toISOString());
    e.dataTransfer.setData("fromRow", task.rowIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, targetDate: Date, toRow: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromDate = e.dataTransfer.getData("fromDate");
    const fromRow = parseInt(e.dataTransfer.getData("fromRow"));

    if (fromDate === targetDate.toISOString() && fromRow === toRow) return;

    startTransition(async () => {
      setOptimisticTasks({
        type: "MOVE",
        payload: { id: taskId, plannedDate: targetDate, rowIndex: toRow }
      });

      try {
        await updateTaskPosition({ 
          id: taskId, 
          plannedDate: targetDate.toISOString(), 
          rowIndex: toRow 
        });
        router.refresh();
      } catch {
        router.refresh();
      }
    });
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-3 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">30-Day Rolling Study Planner</h2>
          <p className="text-sm text-slate-400 mt-1">Scroll horizontally • Drag tasks across 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleRowChange(Math.max(1, rows - 1))} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>−</button>
          <span className="text-sm text-slate-400 px-3">{rows} Rows</span>
          <button onClick={() => handleRowChange(rows + 1)} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>+</button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 -mx-1">
        <div className="min-w-[4500px]">
          <div className="grid grid-cols-30 gap-2 sm:gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
            {plannerDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border p-2 sm:p-3 text-center font-semibold text-sm sm:text-base",
                  day.isToday
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.08] bg-white/[0.03] text-white"
                )}
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="font-semibold tracking-wide">{day.label}</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {day.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="grid grid-cols-30 gap-2 sm:gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
              {plannerDays.map((day) => {
                const dateString = formatDateKey(day.date);
                const cellKey = `${dateString}-${row}`;
                const cellTasks = taskMap[cellKey];

                return (
                  <div
                    key={cellKey}
                    onClick={() => setSelectedCell({ date: day.date, row })}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day.date, row)}
                    className="group/cell min-h-[140px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2.5 sm:p-3 transition-all hover:border-white/30 hover:bg-white/[0.04] cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {cellTasks?.map((task: OptimisticTask) => (
                        <div
                          key={task.id}
                          draggable={!task.isOptimistic}
                          onDragStart={(e) => handleDragStart(e, task)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "group rounded-xl bg-white/[0.04] border border-white/10 p-3 mb-2 relative flex items-start gap-3 hover:bg-white/[0.08] transition-all cursor-grab active:cursor-grabbing",
                            task.completed && "opacity-70",
                            task.isOptimistic && "opacity-75"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id, task.completed)}
                            className="mt-1 accent-blue-600 cursor-pointer w-5 h-5 flex-shrink-0"
                          />

                          <div className="flex-1 min-w-[90px]">
                            {task.time && <div className="text-xs text-slate-400 mb-1">{task.time}</div>}
                            
                            {task.carryForward && (
                              <>
                                {/* Temporary Verification Log Requested */}
                                {console.log("[IN-COMPONENT BADGE VERIFICATION]:", task.title, "carryForwardDays =", task.carryForwardDays)}
                                
                                <div
                                  className={cn(
                                    "mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                                    task.carryForwardDays === 1 && "border border-amber-500/20 bg-amber-500/10 text-amber-400",
                                    task.carryForwardDays >= 2 && task.carryForwardDays <= 3 && "border border-orange-500/20 bg-orange-500/10 text-orange-400",
                                    task.carryForwardDays >= 4 && "border border-red-500/20 bg-red-500/10 text-red-400"
                                  )}
                                >
                                  {task.carryForwardDays === 1
                                    ? "Yesterday"
                                    : task.carryForwardDays >= 7
                                    ? `${Math.floor(task.carryForwardDays / 7)} Week${Math.floor(task.carryForwardDays / 7) > 1 ? "s" : ""} Overdue`
                                    : `${task.carryForwardDays} Days Overdue`}
                                </div>
                              </>
                            )}

                            <div className="flex items-start gap-2">
                              {task.carryForward && (
                                <div className={cn(
                                  "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                                  task.carryForwardDays === 1 && "bg-amber-500/10 text-amber-400",
                                  task.carryForwardDays >= 2 && task.carryForwardDays <= 3 && "bg-orange-500/10 text-orange-400",
                                  task.carryForwardDays >= 4 && "bg-red-500/10 text-red-400"
                                )}>
                                  <CornerDownRight className="h-3 w-3 stroke-[2.5]" />
                                </div>
                              )}

                              <div
                                className={cn(
                                  "w-full break-words whitespace-normal overflow-hidden text-[13px] sm:text-sm font-medium leading-tight",
                                  task.completed && "line-through text-slate-400"
                                )}
                              >
                                {task.title}
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:block opacity-0 group-hover:opacity-100 self-center flex-shrink-0 transition-opacity">
                            <GripVertical className="h-5 w-5 text-slate-500" />
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-rose-400 hover:text-rose-300 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {(!cellTasks || cellTasks.length === 0) && (
                      <div className="w-full text-center py-6 text-xs text-slate-500 opacity-30 group-hover/cell:opacity-100 group-hover/cell:text-blue-400 transition-all font-medium">
                        + Add Task
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Input Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={resetAddForm}>
          <div className="w-full max-w-md rounded-3xl bg-[#0E121B] p-6 border border-white/[0.08]" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Add New Task</h3>
            <p className="text-xs text-slate-400 mb-5">
              Scheduling for {selectedCell.date.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
            <div className="space-y-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time (e.g. 10:00 AM)" className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={resetAddForm} className="flex-1 rounded-xl border border-white/[0.08] py-3 hover:bg-white/[0.05]">Cancel</button>
              <button 
                onClick={handleAddTask}
                disabled={isPending || !title.trim()}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:opacity-70 transition-all"
              >
                {isPending ? "Saving..." : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
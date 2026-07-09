"use client";

import { useState, useTransition, useOptimistic, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical } from "lucide-react";
import { addWeeklyPlanTask, deleteWeeklyPlanTask, updatePlannerRows, updateTaskPosition, toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";

// --- Step 3.1: Updated Types (Completely removed day and originalDay) ---
type PlannerTask = {
  id: string;
  plannedDate: Date;
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
  carryForward: boolean;
};

type OptimisticTask = PlannerTask & { isOptimistic?: boolean };

// --- Rolling Date List Builder (Upgraded to 30 Days) ---
function getPlannerDays() {
  const today = new Date();

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    // Dynamic formatting labels
    let label = date.toLocaleDateString("en-GB", { weekday: "short" });
    if (index === 0) label = "Today";
    if (index === 1) label = "Tomorrow";

    return {
      label,
      date,
      isToday: index === 0,
    };
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
  
  // --- Step 3.4: Updated selectedCell State ---
  const [selectedCell, setSelectedCell] = useState<{
    date: Date;
    row: number;
  } | null>(null);
  
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
            task.id === action.payload.id ? { ...task, completed: action.payload.completed } : task
          );
        default:
          return state;
      }
    }
  );

  // --- Step 3.3: Task Map Strategy using Stable YYYY-MM-DD Keys ---
  const taskMap = useMemo(() => {
    return optimisticTasks.reduce((acc, task) => {
      if (!task.plannedDate) return acc;
      const key = `${new Date(task.plannedDate).toISOString().slice(0, 10)}-${task.rowIndex}`;
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

    // --- Step 3.6: Update Optimistic Task Payload with plannedDate ---
    const newTask: OptimisticTask = {
      id: `temp-${Date.now()}`,
      plannedDate: selectedCell.date,
      rowIndex: selectedCell.row,
      title: title.trim(),
      time: time.trim() || null,
      completed: false,
      carryForward: false,
      isOptimistic: true,
    };

    startTransition(async () => {
      setOptimisticTasks({ type: "ADD", payload: newTask });
      resetAddForm();

      try {
        // --- Step 3.7: Safe Database Action Dispatch ---
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
      await updateTaskPosition({ 
        id: taskId, 
        plannedDate: targetDate.toISOString(), 
        rowIndex: toRow 
      });
      router.refresh();
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
          
          {/* Timeline header grid */}
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
                    {day.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Row Generation loop */}
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="grid grid-cols-30 gap-2 sm:gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
              {plannerDays.map((day) => {
                // --- Step 3.8: Normalized Date String Slicing Lookup Key ---
                const cellKey = `${day.date.toISOString().slice(0, 10)}-${row}`;
                const cellTasks = taskMap[cellKey];

                return (
                  <div
                    key={cellKey}
                    // --- Step 3.5: Cell Click Context ---
                    onClick={() => setSelectedCell({ date: day.date, row })}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day.date, row)}
                    className="min-h-[140px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2.5 sm:p-3 transition-all hover:border-white/30 hover:bg-white/[0.04]"
                  >
                    {cellTasks?.map((task: OptimisticTask) => (
                      <div
                        key={task.id}
                        draggable={!task.isOptimistic}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "group rounded-xl bg-white/[0.04] border border-white/10 p-3 mb-2 relative flex items-start gap-3 hover:bg-white/[0.08] transition-all",
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
                          
                          {/* --- Step 3.9: Updated simplified carry-forward badge --- */}
                          {task.carryForward && (
                            <div className="mb-2 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                              ↪ Carried Forward
                            </div>
                          )}

                          <div 
                            className={cn(
                              "text-[13px] sm:text-sm font-medium leading-tight break-words whitespace-normal",
                              task.completed && "line-through text-slate-400"
                            )}
                            style={{
                              wordBreak: "normal",
                              overflowWrap: "break-word",
                            }}
                          >
                            {task.title}
                          </div>
                        </div>

                        <div className="hidden sm:block opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing self-center flex-shrink-0">
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

                    {(!cellTasks || cellTasks.length === 0) && (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8 opacity-40 hover:opacity-100 transition-opacity">+ Add Task</div>
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
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white" />
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time (e.g. 10:00 AM)" className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white" />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={resetAddForm} className="flex-1 rounded-xl border border-white/[0.08] py-3 hover:bg-white/[0.05]">Cancel</button>
              <button 
                onClick={handleAddTask}
                disabled={isPending || !title.trim()}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:opacity-70"
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
"use client";

import { useState, useTransition, useOptimistic, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical } from "lucide-react";
import { addWeeklyPlanTask, deleteWeeklyPlanTask, updatePlannerRows, updateTaskPosition, toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";

// --- Types Updated ---
type PlannerTask = {
  id: string;
  day: number;
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
  carryForward?: boolean;
  originalDay?: number | null;
};

type OptimisticTask = PlannerTask & { isOptimistic?: boolean };

// For standard JS Date mapping (Sunday = 0)
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// For Database originalDay mapping (Monday = 0)
const ORIGINAL_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getPlannerDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      label: index === 0 ? "Today" : DAY_NAMES[date.getDay()],
      date,
      isToday: index === 0,
      originalDay: date.getDay() === 0 ? 6 : date.getDay() - 1, // Monday = 0
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
  const [selectedCell, setSelectedCell] = useState<{ day: number; row: number } | null>(null);
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

  const taskMap = useMemo(() => {
    return optimisticTasks.reduce((acc, task) => {
      const key = `${task.day}-${task.rowIndex}`;
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
      day: selectedCell.day,
      rowIndex: selectedCell.row,
      title: title.trim(),
      time: time.trim() || null,
      completed: false,
      isOptimistic: true,
    };

    startTransition(async () => {
      setOptimisticTasks({ type: "ADD", payload: newTask });
      resetAddForm();

      try {
        await addWeeklyPlanTask({
          day: selectedCell.day,
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
    if (task.isOptimistic) return;
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromDay", task.day.toString());
    e.dataTransfer.setData("fromRow", task.rowIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, toDay: number, toRow: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromDay = parseInt(e.dataTransfer.getData("fromDay"));
    const fromRow = parseInt(e.dataTransfer.getData("fromRow"));

    if (fromDay === toDay && fromRow === toRow) return;

    startTransition(async () => {
      await updateTaskPosition({ id: taskId, day: toDay, rowIndex: toRow });
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-3 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Study Planner</h2>
          <p className="text-sm text-slate-400 mt-1">Scroll horizontally • Drag tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleRowChange(Math.max(1, rows - 1))} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>−</button>
          <span className="text-sm text-slate-400 px-3">{rows} Rows</span>
          <button onClick={() => handleRowChange(rows + 1)} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>+</button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 -mx-1">
        <div className="min-w-[1150px] sm:min-w-[1250px]">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3">
            {plannerDays.map((day) => (
              <div
                key={day.originalDay}
                className={cn(
                  "rounded-2xl border p-2 sm:p-3 text-center font-semibold text-sm sm:text-base",
                  day.isToday
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.08] bg-white/[0.03] text-white"
                )}
              >
                <div className="flex flex-row items-center justify-center gap-1.5">
                  <span className="font-semibold">
                    {day.label}
                  </span>

                  <span className="text-[11px] text-slate-500 font-normal">
                    {day.isToday
                      ? `• ${day.date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}`
                      : day.date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-2 sm:gap-3 mb-3">
              {plannerDays.map((day) => (
                <div
                  key={`${day.originalDay}-${row}`}
                  onClick={() => setSelectedCell({ day: day.originalDay, row })}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.originalDay, row)}
                  className="min-h-[130px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2.5 sm:p-3 transition-all hover:border-white/30 hover:bg-white/[0.04]"
                >
                  {taskMap[`${day.originalDay}-${row}`]?.map((task: OptimisticTask) => (
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
                        
                        {/* --- NEW CARRY FORWARD BADGE --- */}
                        {task.carryForward && task.originalDay != null && (
                          <div className="mb-2 mt-0.5 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                            ↪ From {ORIGINAL_DAY_NAMES[task.originalDay]}
                          </div>
                        )}

                        <div className={cn(
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

                  {!taskMap[`${day.originalDay}-${row}`] && (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8">+ Add Task</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={resetAddForm}>
          <div className="w-full max-w-md rounded-3xl bg-[#0E121B] p-6 border border-white/[0.08]" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">Add New Task</h3>
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
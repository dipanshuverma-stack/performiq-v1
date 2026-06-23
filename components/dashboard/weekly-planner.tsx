"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical } from "lucide-react";
import { addWeeklyPlanTask, deleteWeeklyPlanTask, updatePlannerRows, updateTaskPosition, toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PlannerTask = {
  id: string;
  day: number;
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
};

type OptimisticTask = PlannerTask & { isOptimistic?: boolean };

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

  const taskMap = optimisticTasks.reduce((acc, task) => {
    const key = `${task.day}-${task.rowIndex}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {} as Record<string, OptimisticTask[]>);

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

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

  const resetAddForm = () => {
    setTitle("");
    setTime("");
    setSelectedCell(null);
  };

  // Fixed Add Task - Modal closes instantly
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
      // Optimistic update + close modal
      setOptimisticTasks({ type: "ADD", payload: newTask });
      resetAddForm();

      // Background save
      try {
        await addWeeklyPlanTask({
          day: selectedCell.day,
          rowIndex: selectedCell.row,
          title: newTask.title,
          time: newTask.time || undefined,
        });
        router.refresh();
      } catch (err) {
        console.error("Failed to add task:", err);
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
    <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Study Planner</h2>
          <p className="text-sm text-slate-400 mt-1">Instant updates • Drag to move</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleRowChange(Math.max(1, rows - 1))} className="h-10 w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>−</button>
          <span className="text-sm text-slate-400 px-3">{rows} Rows</span>
          <button onClick={() => handleRowChange(rows + 1)} className="h-10 w-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={isPending}>+</button>
        </div>
      </div>

      {/* Rest of your grid remains the same */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 gap-3 mb-3">
            {DAYS.map((day, index) => (
              <div key={day} className={cn("rounded-2xl border p-3 text-center font-semibold", 
                index === todayIndex ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-white/[0.08] bg-white/[0.03] text-white")}>
                {day}
              </div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-3 mb-3">
              {DAYS.map((_, dayIndex) => (
                <div
                  key={`${dayIndex}-${row}`}
                  onClick={() => setSelectedCell({ day: dayIndex, row })}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dayIndex, row)}
                  className="min-h-[120px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-white/30 hover:bg-white/[0.04]"
                >
                  {taskMap[`${dayIndex}-${row}`]?.map((task: OptimisticTask) => (
                    <div
                      key={task.id}
                      draggable={!task.isOptimistic}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "group rounded-xl bg-white/[0.04] border border-white/10 p-3 mb-2 relative flex gap-3 hover:bg-white/[0.08] transition-all",
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

                      <div className="flex-1 min-w-0">
                        {task.time && <div className="text-xs text-slate-400 mb-1">{task.time}</div>}
                        <div className={cn("text-sm font-medium break-words", task.completed && "line-through text-slate-400")}>
                          {task.title}
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing self-center">
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

                  {!taskMap[`${dayIndex}-${row}`] && (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">+ Add Task</div>
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
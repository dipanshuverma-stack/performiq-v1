"use client";

import { useState, useTransition, useOptimistic, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addWeeklyPlanTask, deleteWeeklyPlanTask, updatePlannerRows, toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";
import { PlannerTask, OptimisticTask, PlannerModalState, RepeatType } from "@/lib/planner/types";
import { formatDateKey, getPlannerDays } from "@/lib/planner/utils";
import { plannerDateKey } from "@/lib/planner/planner-date";
import { usePlannerDragDrop } from "@/hooks/use-planner-drag-drop";
import { PlannerTaskCard } from "./planner-task-card";
import { PlannerEmptyCell } from "./planner-empty-cell";
import { PlannerTaskModal } from "./planner-task-modal";
import AchievementUnlockDialog from "@/components/achievements/achievement-unlock-dialog";
import { type UnlockResult } from "@/lib/achievements/unlock";

export function WeeklyPlanner({
  plannerTasks: initialTasks,
  initialRows,
}: {
  plannerTasks: PlannerTask[];
  initialRows: number;
}) {
  const [rows, setRows] = useState(initialRows);
  const [modalState, setModalState] = useState<PlannerModalState>(null);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockResult[]>([]);

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
              ? { ...task, completed: action.payload.completed, ...(action.payload.completed && { carryForward: false }) } 
              : task
          );
        case "MOVE":
          return state.map((task) =>
            task.id === action.payload.id
              ? { ...task, plannedDate: action.payload.plannedDate, rowIndex: action.payload.rowIndex, carryForward: false }
              : task
          );
        default:
          return state;
      }
    }
  );

  const { handleDragStart, handleDragOver, handleDrop } = usePlannerDragDrop({
    setOptimisticTasks,
    startTransition,
    router
  });

  const taskMap = useMemo<Record<string, OptimisticTask[]>>(() => {
    return optimisticTasks.reduce((acc, task) => {
      if (!task.plannedDate) return acc;
      const key = `${formatDateKey(task.plannedDate)}-${task.rowIndex}`;
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

  const handleSaveModal = (payload: { 
    title: string; 
    time: string; 
    repeatType: RepeatType; 
    repeatWeekdays: string[];
    occurrences?: number;
  }) => {
    if (!modalState || modalState.mode !== "create") return;
    
    const newTask: OptimisticTask = {
      id: `temp-${Date.now()}`,
      plannedDate: modalState.date,
      rowIndex: modalState.row,
      title: payload.title,
      time: payload.time || null,
      completed: false,
      carryForward: false,
      isOptimistic: true,
    };

    startTransition(async () => {
      setOptimisticTasks({ type: "ADD", payload: newTask });
      setModalState(null);
      try {
        await addWeeklyPlanTask({
          plannedDate: plannerDateKey(modalState.date),
          rowIndex: modalState.row,
          title: newTask.title,
          time: newTask.time || undefined,
          repeatType: payload.repeatType,
          repeatWeekdays: payload.repeatWeekdays,
          occurrences: payload.occurrences,
        });
      } catch {
        router.refresh();
      }
    });
  };

  const handleDeleteTask = useCallback((taskId: string) => {
    startTransition(async () => {
      setOptimisticTasks({ type: "DELETE", payload: { id: taskId } });
      try {
        await deleteWeeklyPlanTask(taskId);
      } catch {
        router.refresh();
      }
    });
  }, [setOptimisticTasks, router]);

  const handleToggleComplete = useCallback((taskId: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    startTransition(async () => {
      setOptimisticTasks({ type: "TOGGLE", payload: { id: taskId, completed: newCompleted } });
      try {
        const result = await toggleTaskCompletion(taskId);
        if (result.unlockedAchievements.length > 0) {
          setUnlockedAchievements(result.unlockedAchievements);
          setShowAchievementDialog(true);
        }
      } catch {
        router.refresh();
      }
    });
  }, [setOptimisticTasks, router]);


  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-3 sm:p-6">
      {/* Header Panel */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Study Planner</h2>
          <p className="text-sm text-slate-400 mt-0.5">30-Day rolling schedule</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 font-medium">Rows</span>
          <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
            <button 
              onClick={() => handleRowChange(Math.max(1, rows - 1))} 
              className="h-8 w-8 rounded-lg text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors flex items-center justify-center font-semibold"
              disabled={isPending}
              title="Decrease total grid rows"
              aria-label="Decrease grid rows"
            >
              −
            </button>
            <span className="text-xs font-semibold text-slate-300 min-w-[24px] text-center">{rows}</span>
            <button 
              onClick={() => handleRowChange(rows + 1)} 
              className="h-8 w-8 rounded-lg text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors flex items-center justify-center font-semibold"
              disabled={isPending}
              title="Increase total grid rows"
              aria-label="Increase grid rows"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main Timeline Grid Track */}
      <div className="overflow-x-auto pb-4 -mx-1 scrollbar-thin">
        <div className="min-w-max">
          <div className="grid gap-2 sm:gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(30, 180px)' }}>
            {plannerDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border p-2 sm:p-3 text-center font-semibold text-sm sm:text-base select-none",
                  day.isToday ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-white/[0.08] bg-white/[0.03] text-white"
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
            <div key={row} className="grid gap-2 sm:gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(30, 180px)' }}>
              {plannerDays.map((day) => {
                const cellKey = `${formatDateKey(day.date)}-${row}`;
                const cellTasks: OptimisticTask[] | undefined = taskMap[cellKey];

                return (
                  <div
                    key={cellKey}
                    onClick={() => setModalState({ mode: "create", date: day.date, row })}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day.date, row)}
                    className="group/cell min-h-[120px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 sm:p-2.5 transition-all hover:border-white/20 hover:bg-white/[0.04] cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-full space-y-3">
                      {cellTasks?.map((task: OptimisticTask) => (
                        <PlannerTaskCard 
                          key={task.id} 
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>

                    {(!cellTasks || cellTasks.length === 0) && <PlannerEmptyCell />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <PlannerTaskModal 
        state={modalState}
        onClose={() => setModalState(null)}
        onSave={handleSaveModal}
        isPending={isPending}
      />

      <AchievementUnlockDialog
        open={showAchievementDialog}
        achievements={unlockedAchievements}
        onClose={() => {
          setShowAchievementDialog(false);
          setUnlockedAchievements([]);
        }}
      />
    </div>
  );
}
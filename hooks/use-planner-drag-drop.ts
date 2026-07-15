import { useCallback, TransitionStartFunction } from "react";
import { OptimisticTask } from "@/lib/planner/types";
import { updateTaskPosition } from "@/app/actions/planner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DragDropConfig {
  setOptimisticTasks: (action: { type: "MOVE"; payload: any }) => void;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}

export function usePlannerDragDrop({ setOptimisticTasks, startTransition, router }: DragDropConfig) {
  const handleDragStart = useCallback((e: React.DragEvent, task: OptimisticTask) => {
    if (task.isOptimistic || !task.plannedDate) return;
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromDate", new Date(task.plannedDate).toISOString());
    e.dataTransfer.setData("fromRow", task.rowIndex.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetDate: Date, toRow: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromDate = e.dataTransfer.getData("fromDate");
    const fromRow = parseInt(e.dataTransfer.getData("fromRow"), 10);

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
  }, [setOptimisticTasks, startTransition, router]);

  return { handleDragStart, handleDragOver, handleDrop };
}
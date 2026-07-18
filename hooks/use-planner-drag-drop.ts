import { DragEvent } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { updateTaskPosition } from "@/app/actions/planner";
import { plannerDateKey } from "@/lib/planner/planner-date";
import { OptimisticTask } from "@/lib/planner/types";

interface UsePlannerDragDropProps {
  setOptimisticTasks: (action: { type: string; payload: any }) => void;
  startTransition: (callback: () => Promise<void>) => void;
  router: AppRouterInstance;
}

export function usePlannerDragDrop({
  setOptimisticTasks,
  startTransition,
  router,
}: UsePlannerDragDropProps) {
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: OptimisticTask) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromRow", String(task.rowIndex));
    // FIX: Serialize the origin date key honoring the 3 AM study boundary
    e.dataTransfer.setData("fromDate", plannerDateKey(new Date(task.plannedDate)));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetDate: Date,
    toRow: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = e.dataTransfer.getData("taskId");
    const fromRow = parseInt(e.dataTransfer.getData("fromRow"), 10);
    const fromDate = e.dataTransfer.getData("fromDate");

    if (!taskId) return;

    // FIX: Normalize target drop zone dates utilizing the unified system date key
    const targetDateKey = plannerDateKey(targetDate);

    // Cancel processing if task dropping exactly on its pre-existing layout coordinates
    if (fromDate === targetDateKey && fromRow === toRow) {
      return;
    }

    startTransition(async () => {
      // Execute local layout transformations seamlessly using structural Date values
      setOptimisticTasks({
        type: "MOVE",
        payload: {
          id: taskId,
          plannedDate: targetDate,
          rowIndex: toRow,
        },
      });

      try {
        // FIX: Transmit unified 3 AM format parameter strings directly to the action engine
        await updateTaskPosition({
          id: taskId,
          plannedDate: targetDateKey,
          rowIndex: toRow,
        });
      } catch {
        router.refresh();
      }
    });
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
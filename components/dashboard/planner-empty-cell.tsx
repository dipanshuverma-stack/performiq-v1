import { Plus } from "lucide-react";

export function PlannerEmptyCell() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 text-slate-500 opacity-0 group-hover/cell:opacity-100 transition-all duration-200 ease-out select-none">
      <Plus className="h-5 w-5 text-blue-400/80 mb-1" />
      <span className="text-[11px] font-semibold tracking-wide text-blue-400/80 uppercase">Add Task</span>
    </div>
  );
}
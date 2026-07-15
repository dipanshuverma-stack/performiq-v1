export type PlannerTask = {
  id: string;
  plannedDate: Date | string; 
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
  carryForward: boolean;
};

export type OptimisticTask = PlannerTask & { isOptimistic?: boolean };

export type RepeatType = "NONE" | "DAILY" | "ALTERNATE" | "EVERY_THREE_DAYS" | "CUSTOM";

export type PlannerModalState = 
  | { mode: "create"; date: Date; row: number }
  | { mode: "edit"; task: PlannerTask }
  | null;

export interface PlannerDay {
  label: string;
  date: Date;
  isToday: boolean;
}
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toggleTaskCompletion } from "@/app/actions/planner";
import { cn } from "@/lib/utils";
import { getOverdueDays } from "@/lib/planner/overdue";

type PlannerTask = {
  id: string;
  plannedDate: Date | string;
  rowIndex: number;
  title: string;
  time?: string | null;
  completed: boolean;
};

interface OverdueTasksCardProps {
  tasks: PlannerTask[];
}

export function OverdueTasksCard({ tasks }: OverdueTasksCardProps) {
  const router = useRouter();

  if (!tasks || tasks.length === 0) return null;

  // Group tasks by overdue period categories
  const groups = tasks.reduce((acc, task) => {
    const days = getOverdueDays(task.plannedDate);
    let category = "Previous Work";
    let style = "border-red-500/20 bg-red-500/10 text-red-400";

    if (days === 1) {
      category = "Yesterday";
      style = "border-amber-500/20 bg-amber-500/10 text-amber-400";
    } else if (days >= 2 && days <= 3) {
      category = `${days} Days Ago`;
      style = "border-orange-500/20 bg-orange-500/10 text-orange-400";
    } else if (days >= 4 && days < 7) {
      category = "Earlier This Week";
    } else if (days >= 7) {
      category = "Last Week & Older";
    }

    if (!acc[category]) {
      acc[category] = { label: category, style, items: [] };
    }
    acc[category].items.push(task);
    return acc;
  }, {} as Record<string, { label: string; style: string; items: PlannerTask[] }>);

  return (
    <div className="mb-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Continue Previous Work</h3>
          <p className="text-xs text-slate-400">Pick up right where you left off on these items.</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.values(groups).map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border", group.style)}>
                {group.label}
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#0E121B] p-3.5 transition-all hover:border-white/10"
                >
                  <button
                    onClick={async () => {
                      try {
                        await toggleTaskCompletion(task.id);
                        router.refresh();
                      } catch (error) {
                        console.error("Failed to update status:", error);
                      }
                    }}
                    className="mt-0.5 text-slate-500 hover:text-blue-400 transition flex-shrink-0"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    {task.time && (
                      <div className="text-xs text-slate-500 mb-0.5">{task.time}</div>
                    )}
                    <p className="text-[13px] font-medium text-slate-200 break-words leading-tight">
                      {task.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
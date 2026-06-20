"use client";

import { cn } from "@/lib/utils";

interface TaskHeroProps {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

export function TaskHero({
  total,
  completed,
  pending,
  percentage,
}: TaskHeroProps) {
  
  return (
    <div className="border-y border-white/[0.05] py-10 space-y-6 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-sm font-medium text-slate-400 block">
                Today's Progress
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {total === 0
                  ? "Ready to begin your deep focus tracking."
                  : pending === 0
                  ? "All study goals completed. Keep the momentum going."
                  : `${completed} of ${total} study goals completed`}
              </p>
            </div>
            
            <span 
              className="text-2xl font-black text-white tabular-nums transition-all duration-300"
            >
              {percentage}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.04]">
            <div
              className="h-full bg-indigo-500 rounded-full transition-[width] duration-700 ease-out shadow-md shadow-indigo-500/30"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 md:border-l md:border-white/5 md:pl-8 md:min-w-[260px]">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Total
            </p>
            <p className="text-xl font-bold text-white mt-0.5 tabular-nums">{total}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Completed
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5 tabular-nums">{completed}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Pending
            </p>
            <p className="text-xl font-bold text-indigo-400 mt-0.5 tabular-nums">{pending}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
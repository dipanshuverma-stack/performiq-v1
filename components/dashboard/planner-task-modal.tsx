"use client";

import { useState, useEffect } from "react";
import { PlannerModalState, RepeatType } from "@/lib/planner/types";
import { REPEAT_OPTIONS, WEEKDAYS } from "@/lib/planner/constants";
import { generateRepeatPreview } from "@/lib/planner/utils";
import { cn } from "@/lib/utils";

interface PlannerTaskModalProps {
  state: PlannerModalState;
  onClose: () => void;
  onSave: (payload: { title: string; time: string; repeatType: RepeatType; repeatWeekdays: string[] }) => void;
  isPending: boolean;
}

export function PlannerTaskModal({ state, onClose, onSave, isPending }: PlannerTaskModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeatType, setRepeatType] = useState<RepeatType>("NONE");
  const [repeatWeekdays, setRepeatWeekdays] = useState<string[]>([]);

  useEffect(() => {
    if (state?.mode === "edit") {
      setTitle(state.task.title);
      setTime(state.task.time || "");
    } else {
      setTitle("");
      setTime("");
      setRepeatType("NONE");
      setRepeatWeekdays([]);
    }
  }, [state]);

  if (!state) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), time: time.trim(), repeatType, repeatWeekdays });
  };

  const previewDates = state.mode === "create" 
    ? generateRepeatPreview(state.date, repeatType, repeatWeekdays) 
    : [];

  const headlineText = state.mode === "edit" ? "Edit Task" : "Add New Task";
  const labelContextText = state.mode === "edit" 
    ? "Modify details below" 
    : `Scheduling for ${state.date.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'short' })}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-[#0E121B] p-6 border border-white/[0.08]" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-1">{headlineText}</h3>
        <p className="text-xs text-slate-400 mb-5">{labelContextText}</p>
        
        <div className="space-y-4">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Task title" 
            className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
          />
          <input 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            placeholder="Time (e.g. 10:00 AM)" 
            className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
          />
          
          {state.mode === "create" && (
            <div className="pt-2">
              <label className="mb-3 block text-sm font-medium text-slate-300">Repeat</label>
              <div className="grid grid-cols-2 gap-2">
                {REPEAT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRepeatType(option.value)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm transition-all",
                      repeatType === option.value ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {repeatType !== "NONE" && previewDates.length > 0 && (
                <div className="mt-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3">
                  <div className="text-[11px] font-semibold text-indigo-400/80 uppercase tracking-wider mb-1.5">Generates tasks on:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewDates.map((d, i) => (
                      <span key={i} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] px-2 py-0.5 rounded-md font-medium">
                        {d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </span>
                    ))}
                    {repeatType === "DAILY" && <span className="text-slate-500 text-[11px] self-center ml-0.5">and 25 more days...</span>}
                  </div>
                </div>
              )}

              {repeatType === "CUSTOM" && (
                <div className="mt-4">
                  <label className="mb-3 block text-sm font-medium text-slate-300">Repeat on</label>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map((day) => {
                      const selected = repeatWeekdays.includes(day.key);
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setRepeatWeekdays(curr => selected ? curr.filter(d => d !== day.key) : [...curr, day.key])}
                          className={cn(
                            "aspect-square rounded-xl border text-sm font-semibold transition-all",
                            selected ? "border-indigo-500 bg-indigo-500/15 text-indigo-400" : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20"
                          )}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/[0.08] py-3 text-slate-300 hover:bg-white/[0.05]">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isPending || !title.trim()}
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-70 transition-all"
          >
            {isPending ? "Saving..." : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
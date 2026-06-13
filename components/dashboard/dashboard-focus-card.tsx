import React from "react";
import { GlassCard } from "@/components/ui/glass-card";

interface FocusCardProps {
  topic: string;
  mastery: number;
  focusScore: number;
}

export function DashboardFocusCard({ topic, mastery, focusScore }: FocusCardProps) {
  return (
    <GlassCard className="p-5 flex items-center justify-between gap-4 cursor-pointer group hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs group-hover:text-indigo-50 transition-colors duration-200">
          {topic}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Knowledge:</span>
          {/* I added a dynamic color here: Emerald for high mastery, Amber for average */}
          <span className={`text-xs font-medium ${mastery >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {mastery}%
          </span>
        </div>
      </div>
      
      <div className="text-right shrink-0">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 transition-colors duration-200 group-hover:text-indigo-400/70">
          Focus Score
        </p>
        <p className="text-xl font-black text-indigo-400 drop-shadow-sm">
          {focusScore}
        </p>
      </div>
    </GlassCard>
  );
}
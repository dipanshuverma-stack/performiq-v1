import { GlassCard } from "@/components/ui/glass-card";
import { Zap, AlertCircle, Clock } from "lucide-react";

interface DashboardHeroProps {
  userName: string;
  focusTopic: string;
  priorityTopicsCount: number;
  revisionsDue: number;
  activeExam?: string;
  daysLeft: number; // Added prop
}

export function DashboardHero({ 
  userName, 
  focusTopic, 
  priorityTopicsCount, 
  revisionsDue, 
  activeExam,
  daysLeft // Destructured
}: DashboardHeroProps) {
  return (
    <GlassCard className="p-8">
      {/* Background Layer */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      
      {/* Foreground Layer */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left Side: Dynamic Greeting Block */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome back, {userName}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            {activeExam ? (
              <span className="text-indigo-400 font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {activeExam} Target Mode
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500/80" />
                No Active Exam Selected
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Metrics & Countdown Panel */}
        <div className="flex items-center gap-8 lg:border-l lg:border-white/[0.08] lg:pl-8">
          
          {/* Countdown Indicator */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-blue-400 tabular-nums">
              {daysLeft}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Days Left</p>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Focus Today</p>
              <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
                {focusTopic}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Daily Metrics</p>
              <p className="text-sm font-semibold text-slate-300 mt-0.5">
                {priorityTopicsCount} Priority Topics • <span className={revisionsDue === 0 ? "text-emerald-400" : "text-amber-400"}>{revisionsDue} Revisions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
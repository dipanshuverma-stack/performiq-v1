import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  CheckCircle2, 
  Play, 
  ClipboardList, 
  PenSquare, 
  Target 
} from "lucide-react";

interface DashboardHeroProps {
  userName: string;
  focusTopic: string;
  priorityTopicsCount: number;

  activeExam?: string;
  daysLeft: number;

  currentXP?: number;
  consistencyGoal?: number;

  isConsistencyCompleted?: boolean;
  isFullPowerCompleted?: boolean;

  nextAction: {
    title: string;
    description: string;
    href: string;
  };
}

export const DashboardHero = React.memo(function DashboardHero({
  userName,
  focusTopic,
  priorityTopicsCount,
  activeExam,
  daysLeft,
  isConsistencyCompleted = false,
  isFullPowerCompleted = false,
  currentXP = 0,
  consistencyGoal = 100,
  nextAction,
}: DashboardHeroProps) {
  const hasActiveExam = !!activeExam;

  // Dynamically evaluate core status routing node iconography
  const NextActionIcon =
    nextAction.href === "/practice"
      ? Play
      : nextAction.href === "/tasks"
      ? ClipboardList
      : nextAction.href === "/mocks"
      ? Target
      : PenSquare;

  return (
    <GlassCard className="p-8 border border-white/10 bg-[#0E121B]">
      <div className="flex flex-col">
        
        {/* Section 1: Header & Greeting */}
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              GOOD MORNING
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Hi, {userName} 👋
            </h1>
          </div>
        </section>

        <div className="my-6 h-px bg-white/5" />

        {/* Premium XP Progress Engine Section */}
        <section className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                TODAY'S PROGRESS
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {currentXP}
                <span className="text-muted-foreground text-2xl">
                  {" "}
                  / {consistencyGoal} XP
                </span>
              </h2>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-400">
                ₹{50} Reward
              </p>

              <p className="text-xs text-muted-foreground">
                {Math.max(0, consistencyGoal - currentXP)} XP remaining
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  (currentXP / consistencyGoal) * 100
                )}%`,
              }}
            />
          </div>
        </section>

        {/* Today's Journey Linear Pipeline */}
        <section>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              TODAY'S JOURNEY
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              
              {/* Daily Goal */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isConsistencyCompleted
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {isConsistencyCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      1
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Daily XP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reach {consistencyGoal} XP
                  </p>
                </div>
              </div>

              <div className="h-px flex-1 bg-white/10 min-w-[40px]" />

              {/* Full Power */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isFullPowerCompleted
                      ? "border-blue-500 bg-blue-500/15"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {isFullPowerCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      2
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Full Power
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Double today's reward
                  </p>
                </div>
              </div>

              <div className="h-px flex-1 bg-white/10 min-w-[40px]" />

              {/* Reward */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isFullPowerCompleted
                      ? "border-amber-500 bg-amber-500/15"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {isFullPowerCompleted ? (
                    <span className="text-lg">💰</span>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      3
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Reward
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Treat yourself today
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="my-6 h-px bg-white/5" />

        {/* Section 3: Focus & Exam */}
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Premium Next Action Container */}
            <div className="flex-1">
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-amber-500/20
                  bg-gradient-to-br
                  from-amber-500/[0.06]
                  via-transparent
                  to-transparent
                  p-6
                  transition-all
                  duration-300
                  hover:border-amber-400/40
                  hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]
                "
              >
                {/* Glow Element */}
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400/5 blur-3xl" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
                    <NextActionIcon className="h-6 w-6 text-amber-400" />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                    NEXT ACTION
                  </p>

                  <h3 className="mt-4 text-2xl font-bold">
                    {nextAction.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                    {nextAction.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300">
                      {nextAction.href === "/practice" && "Practice"}
                      {nextAction.href === "/tasks" && "Planner"}
                      {nextAction.href === "/mocks" && "Mock"}
                      {nextAction.href === "/dashboard" && "Completed"}
                    </span>

                    <a
                      href={nextAction.href}
                      className="
                        rounded-xl
                        bg-amber-500
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-black
                        transition-all
                        duration-300
                        hover:scale-[1.03]
                      "
                    >
                      Continue →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Details */}
            <div
              className="
                flex
                min-w-[220px]
                flex-col
                items-end
                justify-center
              "
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                TARGET EXAM
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {hasActiveExam ? activeExam : "No Exam"}
              </h2>

              <p className="mt-2 text-5xl font-black text-blue-400">
                {daysLeft}
              </p>

              <p className="text-sm text-muted-foreground">
                Days Remaining
              </p>
            </div>

          </div>
        </section>

      </div>
    </GlassCard>
  );
});
import React from "react";

interface MistakeIntelligenceProps {
  // Using any to seamlessly accept your current analytics object,
  // but you can strictly type this as your backend expands!
  analytics: any; 
}

export function MistakeIntelligence({ analytics }: MistakeIntelligenceProps) {
  const numericRate = parseFloat(analytics?.resolutionRate || "0");
  const weakestSubject = analytics?.topWeakSubject 
    ? String(analytics.topWeakSubject).replace(/_/g, " ") 
    : "Stable";

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-8 space-y-8">
      
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          MISTAKE INTELLIGENCE
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Recovery Insights
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Analyze recurring mistakes and prioritize your next revision focus.
        </p>
      </div>

      {/* 5-Card Intelligence Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        
        {/* Card 1: Recovery Rate */}
        <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
          <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
          <h3 className="text-xl font-bold text-zinc-100 truncate">
            {analytics?.resolutionRate || "0%"}
          </h3>
          <p className="mt-2 text-[11px] font-medium text-emerald-400">
            {numericRate >= 80 ? "Excellent" : numericRate >= 50 ? "Steady" : "Needs attention"}
          </p>
        </div>

        {/* Card 2: Most Repeated */}
        <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30">
          <p className="text-xs text-muted-foreground mb-1">Most Repeated</p>
          <h3 className="text-xl font-bold text-zinc-100 truncate">
            {/* Rule-based placeholder: Wire to backend topic breakdown later */}
            Quadratic Equations
          </h3>
          <p className="mt-2 text-[11px] font-medium text-orange-400">
            High frequency
          </p>
        </div>

        {/* Card 3: Weakest Subject */}
        <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30">
          <p className="text-xs text-muted-foreground mb-1">Weakest Subject</p>
          <h3 className="text-xl font-bold text-zinc-100 truncate capitalize">
            {weakestSubject.toLowerCase()}
          </h3>
          <p className="mt-2 text-[11px] font-medium text-pink-400">
            Needs revision
          </p>
        </div>

        {/* Card 4: Next Focus */}
        <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30">
          <p className="text-xs text-muted-foreground mb-1">Next Focus</p>
          <h3 className="text-xl font-bold text-zinc-100 truncate capitalize">
            {/* Deterministic routing: points them to their weakest area */}
            {weakestSubject !== "Stable" ? weakestSubject.toLowerCase() : "General Review"}
          </h3>
          <p className="mt-2 text-[11px] font-medium text-blue-400">
            Priority
          </p>
        </div>

        {/* Card 5: AI Recommendation */}
        <div className="relative overflow-hidden group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30">
          {/* Subtle gradient to indicate an AI/Premium feature */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          
          <div className="relative">
            <p className="text-xs text-muted-foreground mb-1">AI Recommendation</p>
            <h3 className="text-xl font-bold text-zinc-400 truncate">
              PerformIQ Engine
            </h3>
            <p className="mt-2 text-[11px] font-medium text-purple-400/50">
              Available soon
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
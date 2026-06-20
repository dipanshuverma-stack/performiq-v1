"use client";

import { useState } from "react";
import MockHero from "./MockHero";
import MockStatsGrid from "./MockStatsGrid";
import MockIntelligence from "./MockIntelligence";
import MockHistory from "./MockHistory";
import MockForm from "./mock-form";
import type { MockAnalytics } from "@/lib/mock/mock-analytics";

interface MockDashboardProps {
  analytics: MockAnalytics;
  mocks: any[];
  empty?: boolean;
}

export default function MockDashboard({
  analytics,
  mocks,
  empty = false,
}: MockDashboardProps) {
  const { stats, intelligence } = analytics;
  const [mode, setMode] = useState<"dashboard" | "create">("dashboard");

  if (empty) {
    return (
      <div className="space-y-10">
        <MockHero
  stats={stats}
  onAddMock={() => setMode("create")}
/>
        <MockForm />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Dashboard Content */}
      <div className="space-y-10">
        <MockHero
          stats={stats}
          onAddMock={() => setMode("create")}
        />

        <MockStatsGrid stats={stats} />

        {/* Performance Intelligence */}
        <MockIntelligence intelligence={intelligence} />

        {/* Mock History */}
        <MockHistory mocks={mocks} />
      </div>

      {/* Slide-Over Panel */}
      {mode === "create" && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMode("dashboard")}
          />

          {/* Panel */}
          <div
            className={`
              fixed right-0 top-0 z-50 h-screen w-full max-w-2xl 
              overflow-y-auto border-l border-white/[0.08] bg-[#090D16] 
              shadow-2xl transition-transform duration-300 ease-out
              ${mode === "create" ? "translate-x-0" : "translate-x-full"}
            `}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#090D16]/95 backdrop-blur-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  MOCK LOGGER
                </p>
                <h2 className="mt-2 text-3xl font-bold">Log Mock Test</h2>
              </div>

              <button
                onClick={() => setMode("dashboard")}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors text-2xl text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <MockForm />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
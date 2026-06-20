"use client";

import MockForm from "./mock-form";
import { GlassCard } from "@/components/ui/glass-card";

export default function MockEmptyState() {
  return (
    <div className="space-y-8">

      <GlassCard className="p-12 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">

          <span className="text-4xl">
            📝
          </span>

        </div>

        <h2 className="text-3xl font-black">
          Start Your Mock Journey
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-7">
          Record your first mock test to unlock performance analytics,
          subject insights, readiness tracking and intelligent recommendations.
        </p>

      </GlassCard>

      <MockForm />

    </div>
  );
}
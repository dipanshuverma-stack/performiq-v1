"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";

interface Props {
  data: {
    session: number;
    qpm: number;
  }[];
}

export const DashboardQpmChart = React.memo(function DashboardQpmChart({
  data = [],
}: Props) {
  if (data.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <SectionHeader title="QPM Trend" />
        <p className="text-slate-400 mt-8">No QPM data yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Complete timed practice sessions to track your speed
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <SectionHeader title="QPM Trend" />

      <div className="mt-6">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="session"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155" }}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => value.toFixed(1)}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e2937",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value) => [`${Number(value).toFixed(2)}`, "QPM"]}
            />

            <ReferenceLine
              y={1.67}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeOpacity={0.75}
              label={{
                value: "Target (1.67)",
                fill: "#ef4444",
                fontSize: 12,
                position: "top",
              }}
            />

            <Line
              type="monotone"
              dataKey="qpm"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#0f172a" }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Banking PO Target: <span className="text-rose-400 font-medium">100 Questions in 60 Minutes</span>
      </p>
    </GlassCard>
  );
});
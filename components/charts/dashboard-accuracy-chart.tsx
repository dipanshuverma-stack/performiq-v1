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
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";

interface Props {
  data: {
    session: number;
    accuracy: number;
  }[];
}

export const DashboardAccuracyChart = React.memo(function DashboardAccuracyChart({
  data = [],
}: Props) {
  if (data.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <SectionHeader title="Accuracy Trend" />
        <p className="text-slate-400 mt-8">No accuracy data yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Complete practice sessions to see your progress
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <SectionHeader title="Accuracy Trend" />

      <div className="mt-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
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
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e2937",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value) => [`${value}%`, "Accuracy"] as [string, string]}
            />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#0f172a" }}
              activeDot={{ r: 6, fill: "#34d399" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
});
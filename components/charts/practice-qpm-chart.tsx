"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    session: number;
    qpm: number;
  }[];
}

export default function PracticeQpmChart({
  data,
}: Props) {
  return (
    <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        QPM Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.08)" vertical={false} />

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
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e2937",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [`${value}`, "QPM"]}
          />

          <ReferenceLine
            y={1.67}
            stroke="#ef4444"
            strokeDasharray="5 5"
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
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Banking PO Target: <span className="text-rose-400 font-medium">100 Questions in 60 Minutes (1.67 QPM)</span>
      </p>
    </div>
  );
}
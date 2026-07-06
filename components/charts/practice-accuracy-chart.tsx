"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    session: number;
    accuracy: number;
  }[];
}

export default function PracticeAccuracyChart({
  data,
}: Props) {
  return (
    <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Accuracy Trend
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
            formatter={(value) => [`${value}%`, "Accuracy"]}
          />

          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
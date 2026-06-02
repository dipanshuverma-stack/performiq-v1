"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface Props {
  data: {
    session: number;
    qpm: number;
  }[];
}

export default function DashboardQpmChart({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        QPM Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <XAxis dataKey="session" />

          <YAxis />

          <Tooltip />

          <ReferenceLine
            y={1.67}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label="Target"
          />

          <Line
            type="monotone"
            dataKey="qpm"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-3">
        Banking PO Target:
        100 Questions in 60 Minutes
      </p>
    </div>
  );
}
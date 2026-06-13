"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
            label="Target QPM"
          />

          <Line
            type="monotone"
            dataKey="qpm"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-4">
        Banking PO Target: 100 Questions in
        60 Minutes (1.67 QPM)
      </p>
    </div>
  );
}
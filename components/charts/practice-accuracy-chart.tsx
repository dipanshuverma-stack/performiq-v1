"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Accuracy Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <XAxis dataKey="session" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="accuracy"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
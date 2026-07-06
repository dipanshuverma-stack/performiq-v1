"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopicPerformance {
  id: string;
  topic: string;
  questions: number;
  correct: number;
  incorrect: number;
  score: number;
}

interface Props {
  value: TopicPerformance;

  onChange: (
    field: keyof TopicPerformance,
    value: string | number
  ) => void;

  onDelete: () => void;
}

export default function TopicPerformanceRow({
  value,
  onChange,
  onDelete,
}: Props) {
  const attempted = value.correct + value.incorrect;

  const accuracy =
    attempted > 0
      ? Math.round((value.correct / attempted) * 100)
      : 0;

  const invalid = attempted > value.questions;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-5">

      {/* Row Header */}

      <div className="flex items-center justify-between">

        <input
          value={value.topic}
          placeholder="Topic Name"
          onChange={(e) =>
            onChange("topic", e.target.value)
          }
          className="bg-transparent text-sm font-semibold outline-none w-full"
        />

        <button
          type="button"
          onClick={onDelete}
          className="ml-4 rounded-lg p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </div>

      {/* Inputs */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <MetricInput
          label="Questions"
          value={value.questions}
          onChange={(v) => onChange("questions", v)}
        />

        <MetricInput
          label="Correct"
          value={value.correct}
          onChange={(v) => onChange("correct", v)}
        />

        <MetricInput
          label="Incorrect"
          value={value.incorrect}
          onChange={(v) => onChange("incorrect", v)}
        />

        <MetricInput
          label="Score"
          value={value.score}
          onChange={(v) => onChange("score", v)}
        />

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">

        <div>

          <p className="text-xs text-slate-500">
            Attempted
          </p>

          <p
            className={cn(
              "font-semibold",
              invalid
                ? "text-rose-400"
                : "text-slate-300"
            )}
          >
            {attempted} / {value.questions}
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs text-slate-500">
            Accuracy
          </p>

          <p className="font-bold text-indigo-400">
            {accuracy}%
          </p>

        </div>

      </div>

    </div>
  );
}

interface MetricInputProps {
  label: string;
  value: number;

  onChange: (value: number) => void;
}

function MetricInput({
  label,
  value,
  onChange,
}: MetricInputProps) {
  return (
    <div>

      <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">
        {label}
      </label>

      <input
        type="number"
        value={value || ""}
        onChange={(e) =>
          onChange(Number(e.target.value) || 0)
        }
        className="w-full rounded-xl border border-white/[0.08] bg-[#090D16] px-3 py-2.5 text-white outline-none focus:border-indigo-500"
      />

    </div>
  );
}
"use client";

import { Plus } from "lucide-react";
import TopicPerformanceRow, {
  TopicPerformance,
} from "./TopicPerformanceRow";

interface Props {
  topics: TopicPerformance[];

  onAdd: () => void;

  onDelete: (id: string) => void;

  onChange: (
    id: string,
    field: keyof TopicPerformance,
    value: string | number
  ) => void;
}

export default function TopicBreakdownAccordion({
  topics,
  onAdd,
  onDelete,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">

      {topics.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-8 text-center">

          <p className="text-sm text-slate-400">
            No topics added yet.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Add topics to record detailed performance.
          </p>

        </div>
      )}

      {topics.map((topic) => (
        <TopicPerformanceRow
          key={topic.id}
          value={topic}
          onDelete={() => onDelete(topic.id)}
          onChange={(field, value) =>
            onChange(topic.id, field, value)
          }
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="
          flex w-full items-center justify-center gap-2
          rounded-2xl
          border border-dashed border-indigo-500/30
          bg-indigo-500/5
          py-4
          text-sm
          font-medium
          text-indigo-400
          transition-all
          hover:bg-indigo-500/10
        "
      >
        <Plus className="h-4 w-4" />
        Add Topic
      </button>
    </div>
  );
}
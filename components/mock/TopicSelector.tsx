"use client";

import { BANKING_SYLLABUS } from "@/config/syllabus";
import { Subject } from "@prisma/client";
import { CheckCircle2, XCircle } from "lucide-react";

interface TopicSelectorProps {
  subject: Subject;

  weakTopics: string[];
  strongTopics: string[];

  onWeakChange: (topics: string[]) => void;
  onStrongChange: (topics: string[]) => void;
}

export default function TopicSelector({
  subject,
  weakTopics,
  strongTopics,
  onWeakChange,
  onStrongChange,
}: TopicSelectorProps) {
  const topics = BANKING_SYLLABUS[subject];

  function toggleWeak(topic: string) {
    if (weakTopics.includes(topic)) {
      onWeakChange(weakTopics.filter((t) => t !== topic));
    } else {
      onWeakChange([...weakTopics, topic]);

      // Remove from strong if already selected
      if (strongTopics.includes(topic)) {
        onStrongChange(strongTopics.filter((t) => t !== topic));
      }
    }
  }

  function toggleStrong(topic: string) {
    if (strongTopics.includes(topic)) {
      onStrongChange(strongTopics.filter((t) => t !== topic));
    } else {
      onStrongChange([...strongTopics, topic]);

      // Remove from weak if already selected
      if (weakTopics.includes(topic)) {
        onWeakChange(weakTopics.filter((t) => t !== topic));
      }
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white">
        Mark Strong & Weak Topics
      </h4>

      <div className="space-y-2">
        {topics.map((topic) => {
          const isWeak = weakTopics.includes(topic.name);
          const isStrong = strongTopics.includes(topic.name);

          return (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#090D16] px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">
                  {topic.name}
                </p>

                <div className="mt-1 flex gap-2">
                  <span
                    className={`
                      rounded-md px-2 py-0.5 text-[10px] font-semibold
                      ${
                        topic.weightage === "HIGH"
                          ? "bg-red-500/20 text-red-300"
                          : topic.weightage === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-slate-700 text-slate-300"
                      }
                    `}
                  >
                    {topic.weightage}
                  </span>

                  <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
                    {topic.section}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => toggleWeak(topic.name)}
                  className={`
                    flex items-center gap-2 rounded-lg border px-3 py-2 transition

                    ${
                      isWeak
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-white/[0.08] hover:border-red-400 hover:bg-red-500/10 text-slate-400"
                    }
                  `}
                >
                  <XCircle size={16} />
                  Weak
                </button>

                <button
                  type="button"
                  onClick={() => toggleStrong(topic.name)}
                  className={`
                    flex items-center gap-2 rounded-lg border px-3 py-2 transition

                    ${
                      isStrong
                        ? "border-green-500 bg-green-500/20 text-green-300"
                        : "border-white/[0.08] hover:border-green-400 hover:bg-green-500/10 text-slate-400"
                    }
                  `}
                >
                  <CheckCircle2 size={16} />
                  Strong
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
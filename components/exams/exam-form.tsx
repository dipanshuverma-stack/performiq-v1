"use client";

import { useState } from "react";
import { createExamProfile } from "@/app/actions/exam-profile";
import { DatePicker } from "@/components/ui/date-picker";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

export default function ExamForm() {
  const [stage, setStage] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>();

  return (
    <form action={createExamProfile} className="space-y-5">
      {/* Exam Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Exam Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="e.g. SBI PO 2026"
          className={inputClass}
          required
        />
      </div>

      {/* Stage */}
      <div className="space-y-2">
        <label
          htmlFor="stage"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Stage
        </label>
        <select
          id="stage"
          name="stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className={inputClass}
          required
        >
          <option value="" className="bg-[#0E121B] text-muted-foreground">
            Select Stage
          </option>
          <option value="PRELIMS" className="bg-[#0E121B] text-white">
            Prelims
          </option>
          <option value="MAINS" className="bg-[#0E121B] text-white">
            Mains
          </option>
          <option value="CUSTOM" className="bg-[#0E121B] text-white">
            Custom
          </option>
        </select>
      </div>

      {/* Custom Stage Input (Conditional) */}
      {stage === "CUSTOM" && (
        <div className="space-y-2">
          <label
            htmlFor="customStage"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Custom Stage Name
          </label>
          <input
            id="customStage"
            name="customStage"
            placeholder="e.g. Interview / Physical Test"
            className={inputClass}
            required
          />
        </div>
      )}

      {/* Target Date */}
      <div className="space-y-2">
        <label
          htmlFor="targetDate"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Target Date
        </label>
        <DatePicker value={targetDate} onChange={setTargetDate} />
        <input
          type="hidden"
          name="targetDate"
          value={targetDate ? targetDate.toISOString() : ""}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 w-full sm:w-auto"
      >
        Create Exam Profile
      </button>
    </form>
  );
}
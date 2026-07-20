"use client";

import { createExamProfile } from "@/app/actions/exam-profile";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

export default function ExamForm() {
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

      {/* Exam Type */}
      <div className="space-y-2">
        <label
          htmlFor="examType"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Exam Type
        </label>
        <select id="examType" name="examType" className={inputClass} required>
          <option value="" className="bg-[#0E121B] text-muted-foreground">
            Select Exam Type
          </option>
          <option value="SBI_PO" className="bg-[#0E121B] text-white">
            SBI PO
          </option>
          <option value="IBPS_PO" className="bg-[#0E121B] text-white">
            IBPS PO
          </option>
          <option value="RRB_PO" className="bg-[#0E121B] text-white">
            RRB PO
          </option>
          <option value="SBI_CLERK" className="bg-[#0E121B] text-white">
            SBI Clerk
          </option>
          <option value="IBPS_CLERK" className="bg-[#0E121B] text-white">
            IBPS Clerk
          </option>
        </select>
      </div>

      {/* Target Date */}
      <div className="space-y-2">
        <label
          htmlFor="targetDate"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Target Date
        </label>
        <input
          id="targetDate"
          type="date"
          name="targetDate"
          className={inputClass}
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
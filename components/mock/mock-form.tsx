"use client";

import { useState } from "react";
import { createMockTest } from "@/app/actions/mock-test";
import {
  Target,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Clock,
} from "lucide-react";

export default function MockForm() {
  const [mockType, setMockType] = useState("");

  return (
    <form
      id="mock-form"
      action={createMockTest}
      className="space-y-8"
    >
      {/* Basic Information */}
      <div>
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            BASIC INFORMATION
          </p>
          <div className="h-px bg-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <select
            name="mockType"
            value={mockType}
            onChange={(e) => setMockType(e.target.value)}
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/[0.2]"
            required
          >
            <option value="">Select Mock Type</option>
            <option value="PRELIMS">Prelims</option>
            <option value="MAINS">Mains</option>
          </select>

          <input
            name="exam"
            placeholder="Exam Name (SBI PO, IBPS PO, RRB PO)"
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/[0.2]"
            required
          />
        </div>

        <div className="mt-5">
          <input
            name="title"
            placeholder="Mock Title (Optional)"
            className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-white/[0.2]"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            PERFORMANCE METRICS
          </p>
          <div className="h-px bg-white/[0.06]" />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Score */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">SCORE</p>
            </div>
            <input
              type="number"
              name="score"
              placeholder="76"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
              required
            />
          </div>

          {/* Correct */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">CORRECT</p>
            </div>
            <input
              type="number"
              name="correctAnswers"
              placeholder="68"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
              required
            />
          </div>

          {/* Incorrect */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-400" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">INCORRECT</p>
            </div>
            <input
              type="number"
              name="incorrectAnswers"
              placeholder="12"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
              required
            />
          </div>

          {/* Unattempted */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center gap-2">
              <CircleDashed className="h-4 w-4 text-amber-400" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">UNATTEMPTED</p>
            </div>
            <input
              type="number"
              name="unattemptedQuestions"
              placeholder="20"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {/* Total Questions */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">TOTAL QUESTIONS</p>
            <input
              type="number"
              name="totalQuestions"
              placeholder="100"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
              required
            />
          </div>

          {/* Duration */}
          <div className="group rounded-2xl border border-white/[0.06] bg-[#0B1020] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">DURATION (MIN)</p>
            </div>
            <input
              type="number"
              name="duration"
              placeholder="120"
              className="mt-2 w-full bg-transparent text-4xl font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div>
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            SUBJECT BREAKDOWN
          </p>
          <div className="h-px bg-white/[0.06]" />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-6">
          <p className="text-sm text-muted-foreground mb-6">
            {mockType === "PRELIMS"
              ? "Prelims: Reasoning, Quant, English"
              : mockType === "MAINS"
              ? "Mains: Reasoning, Quant, English, GA, Computer"
              : "Select Mock Type First"}
          </p>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">REASONING</p>
              <input
                type="number"
                name="reasoningScore"
                placeholder="32"
                className="mt-3 w-full bg-transparent text-3xl font-bold focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">QUANT</p>
              <input
                type="number"
                name="quantScore"
                placeholder="18"
                className="mt-3 w-full bg-transparent text-3xl font-bold focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">ENGLISH</p>
              <input
                type="number"
                name="englishScore"
                placeholder="24"
                className="mt-3 w-full bg-transparent text-3xl font-bold focus:outline-none"
              />
            </div>

            {mockType === "MAINS" && (
              <>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">GA</p>
                  <input
                    type="number"
                    name="gaScore"
                    placeholder="28"
                    className="mt-3 w-full bg-transparent text-3xl font-bold focus:outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-[#0B1020] p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">COMPUTER</p>
                  <input
                    type="number"
                    name="computerScore"
                    placeholder="25"
                    className="mt-3 w-full bg-transparent text-3xl font-bold focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            NOTES
          </p>
          <div className="h-px bg-white/[0.06]" />
        </div>

        <textarea
          name="notes"
          placeholder="Notes / Learnings from this mock..."
          rows={5}
          className="w-full border border-white/[0.08] bg-[#0B1020] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/[0.2]"
        />
      </div>

      {/* Premium CTA */}
      <button
        type="submit"
        className="
          h-14 w-full rounded-2xl font-bold tracking-[0.18em] uppercase
          bg-gradient-to-r from-blue-600 to-indigo-600
          hover:from-blue-500 hover:to-indigo-500
          transition-all shadow-xl shadow-indigo-900/30
        "
      >
        SAVE MOCK TEST
      </button>
    </form>
  );
}
"use client";

import { createExamProfile } from "@/app/actions/exam-profile";

export default function ExamForm() {
  return (
    <form
      action={createExamProfile}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        name="name"
        placeholder="Exam Name (SBI PO 2026)"
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <select
        name="examType"
        className="w-full border rounded-lg px-4 py-2"
        required
      >
        <option value="">
          Select Exam Type
        </option>

        <option value="SBI PO">
          SBI PO
        </option>

        <option value="IBPS PO">
          IBPS PO
        </option>

        <option value="RRB PO">
          RRB PO
        </option>

        <option value="SBI Clerk">
          SBI Clerk
        </option>

        <option value="IBPS Clerk">
          IBPS Clerk
        </option>
      </select>

      <input
        type="date"
        name="targetDate"
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Create Exam Profile
      </button>
    </form>
  );
}
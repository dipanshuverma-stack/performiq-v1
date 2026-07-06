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
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />

      <select
        name="examType"
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      >
        <option value="">
          Select Exam Type
        </option>

        <option value="SBI_PO">SBI PO</option>
        <option value="IBPS_PO">IBPS PO</option>
        <option value="RRB_PO">RRB PO</option>
        <option value="SBI_CLERK">SBI Clerk</option>
        <option value="IBPS_CLERK">IBPS Clerk</option>
      </select>

      <input
        type="date"
        name="targetDate"
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />

      <button
        type="submit"
        className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto font-medium"
      >
        Create Exam Profile
      </button>
    </form>
  );
}
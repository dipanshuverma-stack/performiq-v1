"use client";

import { useState } from "react";
import { createMockTest } from "@/app/actions/mock-test";

export default function MockForm() {
  const [mockType, setMockType] = useState("");

  return (
    <form
      action={createMockTest}
      className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
    >
      <select
        name="mockType"
        value={mockType}
        onChange={(e) =>
          setMockType(e.target.value)
        }
        className="w-full border rounded-lg px-4 py-2"
        required
      >
        <option value="">
          Select Mock Type
        </option>

        <option value="PRELIMS">
          Prelims
        </option>

        <option value="MAINS">
          Mains
        </option>
      </select>

      <input
        name="exam"
        placeholder="Exam Name (SBI PO, IBPS PO, RRB PO)"
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      <input
        name="title"
        placeholder="Mock Title"
        className="w-full border rounded-lg px-4 py-2"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          name="score"
          placeholder="Score"
          className="border rounded-lg px-4 py-2"
          required
        />

        <input
          type="number"
          name="totalQuestions"
          placeholder="Total Questions"
          className="border rounded-lg px-4 py-2"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="number"
          name="correctAnswers"
          placeholder="Correct Answers"
          className="border rounded-lg px-4 py-2"
          required
        />

        <input
          type="number"
          name="incorrectAnswers"
          placeholder="Incorrect Answers"
          className="border rounded-lg px-4 py-2"
          required
        />

        <input
          type="number"
          name="unattemptedQuestions"
          placeholder="Unattempted Questions"
          className="border rounded-lg px-4 py-2"
          required
        />
      </div>

      <input
        type="number"
        name="duration"
        placeholder="Duration (Minutes)"
        className="w-full border rounded-lg px-4 py-2"
      />

      <div className="border rounded-xl p-4">
        <h3 className="font-semibold mb-2">
          Subject Scores (Optional)
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          {mockType === "PRELIMS"
            ? "Prelims: Reasoning, Quant, English"
            : mockType === "MAINS"
            ? "Mains: Reasoning, Quant, English, GA, Computer"
            : "Select Mock Type First"}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            name="reasoningScore"
            placeholder="Reasoning Marks"
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            name="quantScore"
            placeholder="Quant Marks"
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            name="englishScore"
            placeholder="English Marks"
            className="border rounded-lg px-4 py-2"
          />

          {mockType === "MAINS" && (
            <>
              <input
                type="number"
                name="gaScore"
                placeholder="GA Marks"
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="computerScore"
                placeholder="Computer Marks"
                className="border rounded-lg px-4 py-2"
              />
            </>
          )}
        </div>
      </div>

      <textarea
        name="notes"
        placeholder="Notes / Learnings from this mock"
        rows={4}
        className="w-full border rounded-lg px-4 py-2"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Save Mock Test
      </button>
    </form>
  );
}
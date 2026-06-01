"use client";

import { useState } from "react";
import PracticeTimer from "@/components/practice/practice-timer";
import { savePracticeSession } from "@/app/actions/practice";

export default function PracticePage() {
  const [durationSeconds, setDurationSeconds] =
    useState(0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Practice Timer
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <form
          action={savePracticeSession}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Subject
            </label>

            <select
              name="subject"
              className="w-full border rounded-lg p-3"
            >
              <option value="Reasoning">
                Reasoning
              </option>
              <option value="Quant">
                Quant
              </option>
              <option value="English">
                English
              </option>
              <option value="GA">
                GA
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Topic
            </label>

            <input
              name="topic"
              type="text"
              placeholder="Puzzle"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <PracticeTimer
            onTimeUpdate={
              setDurationSeconds
            }
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Questions
            </label>

            <input
              name="totalQuestions"
              type="number"
              min="1"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Correct Questions
            </label>

            <input
              name="correctQuestions"
              type="number"
              min="0"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <input
            type="hidden"
            name="durationSeconds"
            value={durationSeconds}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Save Session
          </button>
        </form>
      </div>
    </div>
  );
}
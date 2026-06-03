"use client";

import { useState, useTransition } from "react";
import PracticeTimer from "@/components/practice/practice-timer";
import { savePracticeSession } from "@/app/actions/practice";

export default function PracticePage() {
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Force strict client-side validation check
    const formData = new FormData(event.currentTarget);
    const total = Number(formData.get("totalQuestions"));
    const correct = Number(formData.get("correctQuestions"));

    if (correct > total) {
      alert("Correct questions cannot exceed total questions.");
      return;
    }

    // Append the exact updated state value directly to the form instance data payload
    formData.set("durationSeconds", durationSeconds.toString());

    // Execute the server action safely within a protected transition lane
    startTransition(async () => {
      try {
        await savePracticeSession(formData);
      } catch (error) {
        console.error("Failed to save practice session:", error);
        alert("Something went wrong saving your session.");
      }
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Practice Timer
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Subject
            </label>

            <select
              name="subject"
              disabled={isPending}
              className="w-full border rounded-lg p-3 bg-white disabled:bg-gray-100"
            >
              <option value="Reasoning">Reasoning</option>
              <option value="Quant">Quant</option>
              <option value="English">English</option>
              <option value="GA">GA</option>
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
              disabled={isPending}
              className="w-full border rounded-lg p-3 disabled:bg-gray-100"
              required
            />
          </div>

          {/* Keep the current reactive state update parameters bound */}
          <PracticeTimer onTimeUpdate={setDurationSeconds} />

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Questions
            </label>

            <input
              name="totalQuestions"
              type="number"
              min="1"
              disabled={isPending}
              className="w-full border rounded-lg p-3 disabled:bg-gray-100"
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
              disabled={isPending}
              className="w-full border rounded-lg p-3 disabled:bg-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition flex items-center justify-center font-medium"
          >
            {isPending ? "Saving Progress..." : "Save Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
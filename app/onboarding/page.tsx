"use client";

import { useTransition } from "react";
import { createExamProfile } from "@/app/actions/exam-profile";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Safe execution within a transition lifecycle lane
    startTransition(async () => {
      try {
        await createExamProfile(formData);
      } catch (error) {
        console.error("Failed to set up exam profile:", error);
        alert("Something went wrong. Please check your network connection and try again.");
      }
    });
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Setup Your Exam Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Exam Name
          </label>

          <input
            name="examName"
            type="text"
            className="border p-2 w-full rounded disabled:bg-gray-100"
            placeholder="SBI PO, IBPS PO, etc."
            disabled={isPending}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Target Year
          </label>

          <input
            name="targetYear"
            type="number"
            min={2026}
            max={2035}
            className="border p-2 w-full rounded disabled:bg-gray-100"
            placeholder="2026"
            disabled={isPending}
            required
          />
        </div>

        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors w-full sm:w-auto font-medium"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>
    </main>
  );
}
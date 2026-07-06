"use client";

import { activateExamProfile } from "@/app/actions/exam-profile";

export default function ActivateButton({
  examId,
}: {
  examId: string;
}) {
  return (
    <form
      action={async () => {
        await activateExamProfile(examId);
      }}
    >
      <button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
      >
        Set Active
      </button>
    </form>
  );
}
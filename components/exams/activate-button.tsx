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
        className="bg-black text-white px-3 py-1 rounded"
      >
        Set Active
      </button>
    </form>
  );
}
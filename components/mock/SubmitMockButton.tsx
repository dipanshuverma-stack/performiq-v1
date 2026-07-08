"use client";

import { useFormStatus } from "react-dom";

export default function SubmitMockButton({
  disabled,
}: {
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`
        h-14
        w-full
        rounded-2xl
        font-bold
        tracking-[0.18em]
        uppercase
        transition-all

        ${
          disabled || pending
            ? "bg-white/[0.05] text-white/40 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-indigo-900/30 text-white"
        }
      `}
    >
      {pending ? (
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Saving Mock...
        </div>
      ) : (
        "Save Mock Test"
      )}
    </button>
  );
}
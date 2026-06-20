"use client";

import { useTransition } from "react";
import { resolveMistake } from "@/app/actions/mistake-journal";

interface ResolveButtonProps {
  id: string;
}

export default function ResolveButton({ id }: ResolveButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await resolveMistake(id);
        })
      }
      disabled={isPending}
      className="
        rounded-xl
        bg-emerald-500/10
        border
        border-emerald-500/20
        px-4
        py-2
        text-sm
        font-semibold
        text-emerald-400
        hover:bg-emerald-500/20
        transition-all
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {isPending ? (
        "Updating..."
      ) : (
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Resolve
        </span>
      )}
    </button>
  );
}
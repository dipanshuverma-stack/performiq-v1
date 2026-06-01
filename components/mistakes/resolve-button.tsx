"use client";

import { useTransition } from "react";
import { resolveMistake } from "@/app/actions/mistake-journal";

interface ResolveButtonProps {
  id: string;
}

export default function ResolveButton({
  id,
}: ResolveButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await resolveMistake(id);
        })
      }
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-50"
    >
      {isPending
        ? "Updating..."
        : "Mark Resolved"}
    </button>
  );
}
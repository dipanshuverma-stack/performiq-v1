"use client";

import { useTransition } from "react";
import { markNotificationRead } from "@/app/actions/notifications";

export default function ReadButton({
  id,
}: {
  id: string;
}) {
  const [pending, startTransition] =
    useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markNotificationRead(id);
        })
      }
      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
    >
      {pending
        ? "Updating..."
        : "Mark Read"}
    </button>
  );
}
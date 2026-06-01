"use client";

import { useTransition } from "react";
import { seedSyllabus } from "@/app/actions/seed-syllabus";

export default function SeedButton() {
  const [pending, startTransition] =
    useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await seedSyllabus();
          location.reload();
        })
      }
      disabled={pending}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {pending
        ? "Importing..."
        : "Import Banking Syllabus"}
    </button>
  );
}
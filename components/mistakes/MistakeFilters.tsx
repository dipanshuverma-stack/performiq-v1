"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SUBJECTS } from "@/lib/constants/subjects";

export function MistakeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    startTransition(() => {
      router.replace(`/mistakes?${params.toString()}`);
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <select
        value={searchParams.get("subject") || "All"}
        onChange={(e) => updateParam("subject", e.target.value)}
        className="p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="All">All Subjects</option>
        {SUBJECTS.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.icon} {sub.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("status") || "All"}
        onChange={(e) => updateParam("status", e.target.value)}
        className="p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="All">All Statuses</option>
        <option value="PENDING">🔴 Revision Pending</option>
        <option value="RESOLVED">🟢 Mastered Calibration</option>
      </select>

      <select
        value={searchParams.get("sortBy") || "createdAt_DESC"}
        onChange={(e) => updateParam("sortBy", e.target.value)}
        className="p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="createdAt_DESC">Newest Logged</option>
        <option value="createdAt_ASC">Oldest Logged</option>
        <option value="pending_FIRST">Pending Priorities</option>
      </select>
    </div>
  );
}
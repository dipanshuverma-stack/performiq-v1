"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    startTransition(() => {
      // ✅ Prevents pagination back-button loops on layout state shifts
      router.replace(`/practice/history?${params.toString()}`);
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
        <option value="Quant">Quant</option>
        <option value="Reasoning">Reasoning</option>
        <option value="English">English</option>
        <option value="GA">General Awareness</option>
        <option value="Computer">Computer</option>
      </select>

      <select
        value={searchParams.get("status") || "All"}
        onChange={(e) => updateParam("status", e.target.value)}
        className="p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="All">All Statuses</option>
        <option value="UNRESOLVED">Unresolved</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="MASTERED">Mastered</option>
      </select>

      <select
        value={searchParams.get("sortBy") || "createdAt_DESC"}
        onChange={(e) => updateParam("sortBy", e.target.value)}
        className="p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="createdAt_DESC">Newest First</option>
        <option value="accuracy_DESC">Highest Accuracy</option>
        <option value="qpm_DESC">Highest Velocity (QPM)</option>
      </select>
    </div>
  );
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

export function HistorySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
      }
      
      startTransition(() => {
        // ✅ Uses replace inside transition to avoid history stack spamming
        router.replace(`/practice/history?${params.toString()}`);
      });
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query, searchParams, router]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="🔍 Search specific topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm bg-white"
      />
      {isPending && (
        <div className="absolute right-3 top-3.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      )}
    </div>
  );
}
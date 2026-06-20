"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

export function MistakeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  // 1. Sync local state if URL changes from outside (e.g., clearing filters)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // 2. Debounced search trigger (ONLY depends on query)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      const nextSearch = query.trim();

      // Avoid unnecessary navigation if nothing changed
      if (currentSearch === nextSearch) return;

      const params = new URLSearchParams(searchParams.toString());

      if (nextSearch) {
        params.set("search", nextSearch);
      } else {
        params.delete("search");
      }
      
      // Reset to page 1 whenever a new search is performed
      params.set("page", "1");

      startTransition(() => {
        router.replace(`/mistakes?${params.toString()}`);
      });
    }, 350);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); 

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search mistakes, subjects, or topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full h-12 pl-12 pr-10 rounded-2xl border border-white/[0.08] bg-[#0B1020] 
          text-sm text-zinc-100 placeholder:text-zinc-500 transition-all 
          focus:border-red-500/30 focus:outline-none focus:ring-0
        "
      />

      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { MistakeSummary } from "./MistakeSummary";
import { MistakeIntelligence } from "./MistakeIntelligence";
import MistakeForm  from "./mistake-form";
import { MistakeList } from "./MistakeList";
import { MistakePagination } from "./MistakePagination";
import { MistakeSearch } from "./MistakeSearch";
import { MistakeFilters } from "./MistakeFilters";
import { MistakeHero } from "./MistakeHero"; // Assuming you abstract the hero into its own component

export function MistakesContent({ analytics, pendingReviewCount, mistakes, totalPages, currentPage }: any) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10 min-h-screen text-zinc-100">
      
      <MistakeHero onLogMistake={() => setShowForm(!showForm)} />

      <MistakeSummary analytics={analytics} pendingReviewCount={pendingReviewCount} />

      <MistakeIntelligence analytics={analytics} />

      {/* Animated Form Wrapper */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showForm ? "max-h-[2500px] opacity-100 mb-10" : "max-h-0 opacity-0"
        }`}
      >
        <MistakeForm />
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">SEARCH & FILTERS</p>
          <h3 className="mt-2 text-xl font-bold">Find Mistakes</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr] items-center">
          <MistakeSearch />
          <MistakeFilters />
        </div>
      </div>

      <MistakeList initialMistakes={mistakes} />

      {totalPages > 1 && (
        <MistakePagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
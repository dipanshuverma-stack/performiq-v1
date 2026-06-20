"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function MistakePagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (pageTarget: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageTarget.toString());
    router.replace(`/mistakes?${params.toString()}`);
  };

  const navButtonClasses = `
    h-11
    px-5
    rounded-2xl
    border
    border-white/[0.08]
    bg-[#0E121B]
    text-zinc-200
    font-semibold
    transition-all
    duration-300
    hover:border-indigo-500/30
    hover:bg-white/[0.03]
    disabled:opacity-40
    disabled:cursor-not-allowed
  `;

  const renderPageNodes = () => {
    const nodes: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nodes.push(i);
    } else {
      if (currentPage <= 4) {
        nodes.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        nodes.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        nodes.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return nodes.map((node, index) => {
      if (node === "...") {
        return (
          <span key={`ellipse-${index}`} className="flex h-11 w-11 items-center justify-center text-zinc-500 font-bold select-none">
            ...
          </span>
        );
      }

      const isCurrent = node === currentPage;
      return (
        <button
          key={`page-${node}`}
          onClick={() => handlePageChange(node as number)}
          className={`
            h-11
            w-11
            rounded-2xl
            font-semibold
            transition-all
            duration-300
            ${
              isCurrent
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                : "border border-white/[0.08] bg-[#0E121B] text-zinc-300 hover:border-indigo-500/30 hover:bg-white/[0.03]"
            }
          `}
        >
          {node}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 pt-8">
      
      {/* Page Context */}
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-semibold text-white">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-white">
          {totalPages}
        </span>
      </p>

      {/* Controls Container */}
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={navButtonClasses}
        >
          ← Previous
        </button>

        {renderPageNodes()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={navButtonClasses}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
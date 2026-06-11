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
          <span key={`ellipse-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400 select-none">
            ...
          </span>
        );
      }

      const isCurrent = node === currentPage;
      return (
        <button
          key={`page-${node}`}
          onClick={() => handlePageChange(node as number)}
          className={`w-9 h-9 font-bold rounded-lg transition-colors cursor-pointer text-xs ${
            isCurrent 
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10" 
              : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {node}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-1.5 text-sm pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-bold hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {renderPageNodes()}

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-bold hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
"use client";
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  itemType?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemType = "games",
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="bg-black/50 rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results Info */}
        <div className="text-white/70 text-sm">
          Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{" "}
          {totalItems.toLocaleString()} {itemType}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors ${
              currentPage === 1
                ? "bg-black/30 text-white/30 cursor-not-allowed"
                : "bg-black/30 text-white hover:bg-black/50"
            }`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => {
              if (page === "...") {
                return (
                  <div
                    key={`dots-${index}`}
                    className="px-3 py-2 text-white/50"
                  >
                    <MoreHorizontal size={16} />
                  </div>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-3 py-2 rounded-2xl transition-colors min-w-[40px] ${
                    isActive
                      ? "bg-[#bb3b3b] text-white"
                      : "bg-black/30 text-white/70 hover:bg-black/50 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors ${
              currentPage === totalPages
                ? "bg-black/30 text-white/30 cursor-not-allowed"
                : "bg-black/30 text-white hover:bg-black/50"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile-friendly page info */}
      <div className="sm:hidden text-center text-white/50 text-xs mt-4">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
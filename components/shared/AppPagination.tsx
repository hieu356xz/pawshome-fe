"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: AppPaginationProps) {
  const t = useTranslations("Pagination");

  // Logic to show a limited number of page buttons
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 md:gap-4", className)}>
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="rounded-xl gap-1.5 h-9 px-3 md:px-5 hover:bg-primary/5 transition-all group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px]">
          {t("previous")}
        </span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-9 w-9 rounded-xl font-serif font-bold text-sm transition-all",
              currentPage === page
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                : "hover:bg-primary/5 text-muted-foreground"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="rounded-xl gap-1.5 h-9 px-3 md:px-5 hover:bg-primary/5 transition-all group"
      >
        <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px]">
          {t("next")}
        </span>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiMeta } from "@/types";

interface PaginationProps {
  meta: ApiMeta;
  onPageChange: (page: number) => void;
}

function pageNumbers(current: number, total: number): Array<number | "…"> {
  const pages: Array<number | "…"> = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, total } = meta;
  if (total <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageNumbers(page, total).map((p, idx) =>
        p === "…" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition-colors",
              p === page
                ? "bg-brand-600 text-white"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= total}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

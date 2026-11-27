"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRows?: number;
  entityName?: string;
}

export function DataTablePagination<TData>({
  table,
  totalRows,
  entityName = "records",
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  const count = totalRows !== undefined ? totalRows : table.getFilteredRowModel().rows.length;
  const startRow = count === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, count);

  // Generate pagination numbers array
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      if (pageIndex < 4) {
        for (let i = 0; i < maxVisible; i++) pages.push(i);
        pages.push("...");
        pages.push(pageCount - 1);
      } else if (pageIndex > pageCount - 5) {
        pages.push(0);
        pages.push("...");
        for (let i = pageCount - 5; i < pageCount; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push("...");
        pages.push(pageIndex - 1);
        pages.push(pageIndex);
        pages.push(pageIndex + 1);
        pages.push("...");
        pages.push(pageCount - 1);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 rounded-b-xl text-xs text-slate-600">
      {/* Left: Record Range Count */}
      <div className="text-slate-600 font-medium">
        Showing <span className="font-semibold text-slate-800">{startRow}-{endRow}</span> of{" "}
        <span className="font-semibold text-slate-800">{count}</span> {entityName}
      </div>

      {/* Right: Page Navigation Numbers & Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title="First Page"
          className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Previous Page"
          className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">
                  ...
                </span>
              );
            }
            const pageNum = Number(p);
            const isCurrent = pageNum === pageIndex;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => table.setPageIndex(pageNum)}
                className={cn(
                  "w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors",
                  isCurrent
                    ? "bg-[#16834B] text-white shadow-xs"
                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                )}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Next Page"
          className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          title="Last Page"
          className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

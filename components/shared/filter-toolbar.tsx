"use client";

import React, { ReactNode } from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  activeFilterCount?: number;
  onResetFilters?: () => void;
  exportAction?: ReactNode;
  activeFiltersList?: { id: string; label: string; onRemove: () => void }[];
  className?: string;
}

export function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters,
  activeFilterCount = 0,
  onResetFilters,
  exportAction,
  activeFiltersList = [],
  className,
}: FilterToolbarProps) {
  return (
    <div className={cn("space-y-2.5 mb-4", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
        {/* Left Section: Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Center / Right Section: Dropdowns, Reset & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {filters}

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          )}

          {exportAction}
        </div>
      </div>

      {/* Active Filter Chips / Pills */}
      {activeFiltersList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Active:
          </span>
          {activeFiltersList.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium"
            >
              <span>{f.label}</span>
              <button
                onClick={f.onRemove}
                className="hover:text-emerald-950 p-0.5 rounded focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] text-emerald-700 hover:underline font-semibold ml-1 focus:outline-none"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

/**
 * Global App Router loading state.
 * Enables instant React Suspense streaming during navigation transitions.
 */
export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-200/80 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-7 w-7 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-3">
        {/* Search bar skeleton */}
        <div className="h-14 w-full bg-white rounded-xl border border-slate-200/80 p-3 flex items-center gap-3">
          <div className="h-8 flex-1 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse hidden sm:block" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
        </div>

        {/* Data Table Skeleton */}
        <DataTableSkeleton columns={6} rows={6} />
      </div>
    </div>
  );
}

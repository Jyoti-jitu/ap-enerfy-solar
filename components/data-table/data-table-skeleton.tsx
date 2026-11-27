"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function DataTableSkeleton({
  columns = 7,
  rows = 8,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden", className)}>
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
        <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-slate-200 rounded animate-pulse"
            style={{ width: `${Math.max(60, 100 - i * 10)}px` }}
          />
        ))}
      </div>

      {/* Row Skeletons */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="h-12 flex items-center px-4 gap-4">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-3 bg-slate-200 rounded animate-pulse"
                style={{ width: `${Math.max(50, 90 - (cIdx % 3) * 15)}px` }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-4">
        <div className="h-3 bg-slate-200 rounded w-32 animate-pulse" />
        <div className="h-7 bg-slate-200 rounded w-48 animate-pulse" />
      </div>
    </div>
  );
}

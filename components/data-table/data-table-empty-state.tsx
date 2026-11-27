"use client";

import React, { ReactNode } from "react";
import { FolderSearch, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableEmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  className?: string;
}

export function DataTableEmptyState({
  title = "No records found",
  description = "No matching records were found. Try adjusting your search or active filters.",
  action,
  className,
}: DataTableEmptyStateProps) {
  return (
    <div
      className={cn(
        "py-16 px-4 text-center flex flex-col items-center justify-center bg-white",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs mb-3.5">
        <FolderSearch className="w-7 h-7" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
        >
          {action.icon ? <action.icon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please retry or contact support if the issue persists.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "py-12 px-4 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-rose-200 shadow-xs",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-md mt-1 mb-4 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}

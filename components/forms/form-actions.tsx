"use client";

import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormActionsProps {
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  extraActions?: ReactNode;
  className?: string;
}

export function FormActions({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save Changes",
  loading = false,
  disabled = false,
  extraActions,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-slate-200 mt-6",
        className
      )}
    >
      {extraActions}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 focus:outline-none"
        >
          {cancelLabel}
        </button>
      )}

      <button
        type="submit"
        disabled={loading || disabled}
        className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </div>
  );
}

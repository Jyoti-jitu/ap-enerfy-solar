"use client";

import React, { ReactNode } from "react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "destructive" | "primary" | "warning";
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "primary",
  loading = false,
}: ConfirmationDialogProps) {
  const isDestructive = variant === "destructive";

  const getIcon = () => {
    if (isDestructive) {
      return (
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
        <Info className="w-5 h-5" />
      </div>
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-start gap-3.5">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-base font-bold text-slate-900 leading-tight">
                {title}
              </Dialog.Title>
              <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {description}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors focus:outline-none"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                await onConfirm();
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1",
                isDestructive
                  ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                  : "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-600"
              )}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

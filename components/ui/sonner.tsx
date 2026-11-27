"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl text-xs font-medium",
          description: "group-[.toast]:text-slate-500 text-[11px]",
          actionButton:
            "group-[.toast]:bg-emerald-700 group-[.toast]:text-white font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 text-xs",
          success: "group-[.toaster]:border-emerald-200 group-[.toaster]:text-emerald-900",
          error: "group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-900",
          warning: "group-[.toaster]:border-amber-200 group-[.toaster]:text-amber-900",
          info: "group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-900",
        },
      }}
      {...props}
    />
  );
}

"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
  footer,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>}
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[220px]">{children}</div>

      {/* Optional Card Footer */}
      {footer && <div className="mt-3 pt-3 border-t border-slate-100">{footer}</div>}
    </div>
  );
}

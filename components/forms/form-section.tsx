"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4 mb-5",
        className
      )}
    >
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-normal">
            {description}
          </p>
        )}
      </div>

      <div className="pt-1">{children}</div>
    </div>
  );
}

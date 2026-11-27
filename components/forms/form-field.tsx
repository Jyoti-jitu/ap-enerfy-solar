"use client";

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-slate-800 tracking-tight"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      </div>

      {children}

      {description && !error && (
        <p className="text-[11px] text-slate-500 leading-normal">{description}</p>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1 animate-in fade-in-50">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

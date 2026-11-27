"use client";

import React, { forwardRef } from "react";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GSTINInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
  error?: boolean;
}

export const GSTINInput = forwardRef<HTMLInputElement, GSTINInputProps>(
  ({ value = "", onChange, className, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Force uppercase and limit to 15 characters
      const val = e.target.value.toUpperCase().slice(0, 15);
      onChange?.(val);
    };

    return (
      <div className="relative rounded-lg shadow-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Building className="w-4 h-4 text-slate-400" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={15}
          placeholder="21AAAAA0000A1Z5"
          className={cn(
            "block w-full rounded-lg border bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 font-mono tracking-wide transition-colors",
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
              : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-600",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

GSTINInput.displayName = "GSTINInput";

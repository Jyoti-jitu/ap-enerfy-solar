"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number | string;
  onChange?: (val: number | string) => void;
  currencySymbol?: string;
  error?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currencySymbol = "₹", className, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove commas and non-numeric chars (except decimal point)
      const raw = e.target.value.replace(/[^0-9.]/g, "");
      onChange?.(raw);
    };

    // Format with Indian grouping for display
    const formatDisplay = (val?: number | string) => {
      if (val === undefined || val === null || val === "") return "";
      const parts = String(val).split(".");
      const integerPart = parts[0];
      const decimalPart = parts.length > 1 ? "." + parts[1] : "";

      let lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);
      if (otherNumbers !== "") {
        lastThree = "," + lastThree;
      }
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + decimalPart;
    };

    return (
      <div className="relative rounded-lg shadow-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-500 font-semibold text-xs sm:text-sm">
            {currencySymbol}
          </span>
        </div>
        <input
          ref={ref}
          type="text"
          value={formatDisplay(value)}
          onChange={handleChange}
          className={cn(
            "block w-full rounded-lg border bg-white pl-8 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 tabular-nums transition-colors",
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

CurrencyInput.displayName = "CurrencyInput";

"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const FINANCIAL_YEARS = [
  { label: "FY 2025–26", value: "2025-2026", range: "Apr 2025 – Mar 2026" },
  { label: "FY 2024–25", value: "2024-2025", range: "Apr 2024 – Mar 2025", isCurrent: true },
  { label: "FY 2023–24", value: "2023-2024", range: "Apr 2023 – Mar 2024" },
];

export function FinancialYearSelector({
  value = "2024-2025",
  onChange,
}: {
  value?: string;
  onChange?: (fy: string) => void;
}) {
  const [selected, setSelected] = useState(value);

  const activeFy = FINANCIAL_YEARS.find((f) => f.value === selected) || FINANCIAL_YEARS[1];

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Select Financial Year"
          className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium hidden sm:flex items-center gap-1.5 transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800">{activeFy.label}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[180px] bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Financial Year (Apr – Mar)
          </div>

          {FINANCIAL_YEARS.map((fy) => (
            <DropdownMenu.Item
              key={fy.value}
              onClick={() => handleSelect(fy.value)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors",
                selected === fy.value
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <div className="flex flex-col">
                <span>{fy.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">{fy.range}</span>
              </div>
              {selected === fy.value && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

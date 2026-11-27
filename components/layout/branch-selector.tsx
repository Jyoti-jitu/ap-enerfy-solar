"use client";

import React, { useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { usePermissions } from "@/components/shared/PermissionGuard";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const DEFAULT_BRANCHES = [
  { id: "BBSR", name: "Bhubaneswar HQ", code: "BBSR" },
  { id: "CTC", name: "Cuttack Hub", code: "CTC" },
  { id: "PURI", name: "Puri Regional", code: "PURI" },
];

export function BranchSelector({
  selectedBranch = "Bhubaneswar HQ",
  onBranchChange,
}: {
  selectedBranch?: string;
  onBranchChange?: (branch: string) => void;
}) {
  const [current, setCurrent] = useState(selectedBranch);
  const { isSuperAdmin } = usePermissions();

  const handleSelect = (branchName: string) => {
    setCurrent(branchName);
    onBranchChange?.(branchName);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Select Operating Branch"
          className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-[150px] font-semibold text-slate-800">
            {current}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[200px] bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operational Branch
          </div>

          {DEFAULT_BRANCHES.map((b) => (
            <DropdownMenu.Item
              key={b.id}
              onClick={() => handleSelect(b.name)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors",
                current === b.name
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <span>{b.name}</span>
              {current === b.name && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </DropdownMenu.Item>
          ))}

          {isSuperAdmin && (
            <>
              <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
              <DropdownMenu.Item
                onClick={() => handleSelect("All Branches (Consolidated)")}
                className={cn(
                  "flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors",
                  current === "All Branches (Consolidated)"
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <div className="flex flex-col">
                  <span>All Branches</span>
                  <span className="text-[10px] text-slate-400 font-normal">Super Admin Consolidated</span>
                </div>
                {current === "All Branches (Consolidated)" && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

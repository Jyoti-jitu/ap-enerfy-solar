"use client";

import React from "react";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-xs font-semibold text-slate-700", className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-800 -ml-1 px-1.5 py-1 rounded hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-3.5 h-3.5 text-emerald-700" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <ChevronsUpDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="z-50 min-w-[140px] bg-white rounded-lg border border-slate-200 shadow-lg p-1 text-xs space-y-0.5"
          >
            <DropdownMenu.Item
              onClick={() => column.toggleSorting(false)}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-slate-700 hover:bg-slate-100 outline-none"
            >
              <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort Ascending</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => column.toggleSorting(true)}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-slate-700 hover:bg-slate-100 outline-none"
            >
              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort Descending</span>
            </DropdownMenu.Item>
            {column.getCanHide() && (
              <>
                <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                <DropdownMenu.Item
                  onClick={() => column.toggleVisibility(false)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-slate-700 hover:bg-slate-100 outline-none"
                >
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hide Column</span>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

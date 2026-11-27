"use client";

import React from "react";
import { Eye, Pencil, Printer, Download, MoreHorizontal, Trash2, Copy } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface DataTableRowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  extraActions?: {
    label: string;
    icon?: any;
    onClick: () => void;
    destructive?: boolean;
  }[];
}

export function DataTableRowActions({
  onView,
  onEdit,
  onPrint,
  onDownload,
  onDuplicate,
  onDelete,
  extraActions = [],
}: DataTableRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {/* Quick View Icon */}
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="View Details"
          className="p-1 rounded text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors focus:outline-none"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* Quick Edit Icon */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit Record"
          className="p-1 rounded text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors focus:outline-none"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* Quick Print Icon */}
      {onPrint && (
        <button
          type="button"
          onClick={onPrint}
          title="Print Document"
          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <Printer className="w-4 h-4" />
        </button>
      )}

      {/* Quick Download Icon */}
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          title="Download PDF"
          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* More Actions Dropdown */}
      {(onDuplicate || onDelete || extraActions.length > 0) && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              title="More Actions"
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-[140px] bg-white rounded-lg border border-slate-200 shadow-xl p-1 text-xs space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              {onDuplicate && (
                <DropdownMenu.Item
                  onClick={onDuplicate}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer text-slate-700 hover:bg-slate-100 outline-none"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicate</span>
                </DropdownMenu.Item>
              )}

              {extraActions.map((action, i) => (
                <DropdownMenu.Item
                  key={i}
                  onClick={action.onClick}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer text-slate-700 hover:bg-slate-100 outline-none"
                >
                  {action.icon && <action.icon className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{action.label}</span>
                </DropdownMenu.Item>
              ))}

              {onDelete && (
                <>
                  <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                  <DropdownMenu.Item
                    onClick={onDelete}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer text-rose-600 hover:bg-rose-50 outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

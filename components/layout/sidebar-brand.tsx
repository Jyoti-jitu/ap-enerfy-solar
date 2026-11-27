"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarBrand({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div
      className={cn(
        "h-16 flex items-center border-b border-[#1C443C] px-3.5 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 overflow-hidden group focus:outline-none"
      >
        {/* Brand Mark Icon: Solar Lightning & Sun Grid Motif */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-950/40 flex-shrink-0 transition-transform group-hover:scale-105 border border-emerald-400/30">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Solar Panel & Energy Bolt */}
            <path d="M12 2v4" className="text-amber-300 stroke-amber-300" />
            <path d="m4.93 4.93 2.83 2.83" className="text-amber-300 stroke-amber-300" />
            <path d="M2 12h4" className="text-amber-300 stroke-amber-300" />
            <polygon
              points="13 2 9 13 15 13 11 22"
              className="fill-amber-400 stroke-amber-400"
            />
          </svg>
        </div>

        {/* Company Name & Subtitle */}
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
            <span className="text-[15px] font-bold text-white tracking-tight leading-tight truncate">
              AP Enerfy Solar
            </span>
            <span className="text-[11px] font-medium text-emerald-400/90 leading-tight truncate tracking-wide">
              Solar ERP & Billing
            </span>
          </div>
        )}
      </Link>

      {/* Collapse Toggle Button (Desktop) */}
      {!isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
          className="p-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-[#163B35] transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-[#1B5E43] border border-emerald-400/40 text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors focus:outline-none"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

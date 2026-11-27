"use client";

import React from "react";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarFooter } from "./sidebar-footer";
import { cn } from "@/lib/utils";

export function AppSidebar({
  isCollapsed,
  onToggleCollapse,
  onOpenHelp,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp?: () => void;
}) {
  return (
    <aside
      aria-label="Application Navigation"
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col bg-[#102A2A] border-r border-[#1C443C] transition-all duration-300 ease-in-out select-none shadow-xl",
        isCollapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Brand Header */}
      <SidebarBrand isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />

      {/* Main Navigation with Independent Scroll */}
      <SidebarNavigation isCollapsed={isCollapsed} />

      {/* Footer Branding & Version */}
      <SidebarFooter isCollapsed={isCollapsed} onOpenHelp={onOpenHelp} />
    </aside>
  );
}

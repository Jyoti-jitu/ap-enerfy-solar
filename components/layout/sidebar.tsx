"use client";

import { AppSidebar } from "./app-sidebar";
import { NAVIGATION_CONFIG } from "@/config/navigation";

export const navigationItems = NAVIGATION_CONFIG.flatMap((g) => g.items);

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
}) {
  return (
    <AppSidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    />
  );
}

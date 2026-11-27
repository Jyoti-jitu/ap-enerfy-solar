"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG, NavItem, NavGroup } from "@/config/navigation";
import { usePermissions } from "@/components/shared/PermissionGuard";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

export function SidebarNavigation({
  isCollapsed,
  onItemClick,
}: {
  isCollapsed: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin, isLoaded } = usePermissions();

  // Helper to determine if an item is active
  const isItemActive = (item: NavItem) => {
    if (item.exactMatch) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  // Filter items based on permissions
  const filterItem = (item: NavItem): boolean => {
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    if (!isLoaded) return false; // Strict deny-by-default until session resolves
    return hasPermission(item.permission);
  };

  return (
    <Tooltip.Provider delayDuration={150}>
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 no-scrollbar">
        {NAVIGATION_CONFIG.map((group) => {
          // Filter child items
          const visibleItems = group.items.filter(filterItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="space-y-0.5">
              {visibleItems.map((item) => {
                const active = isItemActive(item);
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative",
                        active
                          ? "bg-[#1B5E43] text-white shadow-sm font-semibold"
                          : "text-slate-300 hover:text-white hover:bg-[#163B35]"
                      )}
                    >
                      {/* Active Left Indicator Bar */}
                      {active && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-full" />
                      )}

                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110",
                          active ? "text-amber-300" : "text-emerald-400/80 group-hover:text-emerald-300"
                        )}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1 tracking-tight">
                          {item.title}
                        </span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip.Root key={item.href}>
                        <Tooltip.Trigger asChild>{linkContent}</Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="right"
                            sideOffset={12}
                            className="z-50 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0A1A17] border border-emerald-500/30 rounded-md shadow-lg"
                          >
                            {item.title}
                            {item.badge && (
                              <span className="ml-1.5 text-[10px] text-amber-300">
                                ({item.badge})
                              </span>
                            )}
                            <Tooltip.Arrow className="fill-[#0A1A17]" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    );
                  }

                  return <div key={item.href}>{linkContent}</div>;
                })}
            </div>
          );
        })}
      </nav>
    </Tooltip.Provider>
  );
}

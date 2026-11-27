"use client";

import React, { useState } from "react";
import { Menu, HelpCircle, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { GlobalSearch } from "./global-search";
import { BranchSelector } from "./branch-selector";
import { FinancialYearSelector } from "./financial-year-selector";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { HelpModal } from "./help-modal";

export function AppHeader({
  onOpenMobileMenu,
  isCollapsed,
  onToggleCollapse,
}: {
  onOpenMobileMenu: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white border-b border-slate-200 px-3.5 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
      {/* Left Section: Mobile Trigger, Desktop Collapse, Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle Shortcut */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar width"
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-emerald-700" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            )}
          </button>
        )}

        {/* Dynamic Breadcrumb Trail */}
        <Breadcrumbs />
      </div>

      {/* Center Section: Global Command Search */}
      <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-2">
        <GlobalSearch />
      </div>

      {/* Right Section: Branch, FY, Notifications, Help, User */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <BranchSelector />
        <FinancialYearSelector />
        <NotificationMenu />

        {/* Help Shortcut Button */}
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          title="Help & Quick Guide"
          aria-label="Help and documentation"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden md:flex items-center justify-center focus:outline-none"
        >
          <HelpCircle className="w-5 h-5 text-slate-500 hover:text-emerald-700" />
        </button>

        {/* User Account Dropdown */}
        <UserMenu />
      </div>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
    </header>
  );
}

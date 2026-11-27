"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { AppHeader } from "./app-header";
import { HelpModal } from "./help-modal";
import { Toaster } from "@/components/ui/sonner";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    setIsMobileOpen,
    isMounted,
  } = useSidebar();

  const [showHelp, setShowHelp] = useState(false);

  // Authentication & error routes bypass the main ERP shell
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/change-password" ||
    pathname === "/403";

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-[#081713]">
        {children}
        <Toaster position="top-right" />
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F8FA] flex flex-col antialiased text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-950">
      {/* Accessibility Skip-to-content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-lg focus:shadow-lg focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Desktop Navigation Sidebar (Fixed Left) */}
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Mobile Off-Canvas Drawer (Slide-In) */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Workspace Frame */}
      <div
        className={cn(
          "flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[248px]"
        )}
      >
        {/* Sticky Top Navigation Header */}
        <AppHeader
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapsed}
        />

        {/* Dynamic Page Main Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 max-w-none app-main-content focus:outline-none"
        >
          {children}
        </main>
      </div>

      {/* Global Support & Keyboard Shortcuts Modal */}
      <HelpModal open={showHelp} onOpenChange={setShowHelp} />

      {/* Global Toast Notification System */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

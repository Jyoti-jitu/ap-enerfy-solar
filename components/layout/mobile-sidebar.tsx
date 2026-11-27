"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarFooter } from "./sidebar-footer";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileSidebar({
  isOpen,
  onClose,
  onOpenHelp,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp?: () => void;
}) {
  const pathname = usePathname();

  // Close mobile sidebar automatically on route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[260px] max-w-[85vw] bg-[#102A2A] border-r border-[#1C443C] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left"
        )}
      >
        {/* Header with Close Button */}
        <div className="relative">
          <SidebarBrand isCollapsed={false} />
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="absolute top-4 right-3 p-1.5 rounded-lg text-emerald-300/80 hover:text-white hover:bg-[#163B35] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <SidebarNavigation isCollapsed={false} onItemClick={onClose} />

        {/* Footer */}
        <SidebarFooter isCollapsed={false} onOpenHelp={onOpenHelp} />
      </div>
    </div>
  );
}

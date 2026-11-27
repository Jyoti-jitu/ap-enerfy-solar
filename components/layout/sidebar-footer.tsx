"use client";

import React from "react";
import { Sparkles, HelpCircle, Sun, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarFooter({
  isCollapsed,
  onOpenHelp,
}: {
  isCollapsed: boolean;
  onOpenHelp?: () => void;
}) {
  if (isCollapsed) {
    return (
      <div className="p-3 border-t border-[#1C443C] flex flex-col items-center gap-2">
        <button
          onClick={onOpenHelp}
          title="Support & Guide"
          className="w-9 h-9 rounded-lg bg-[#163B35] text-emerald-300 hover:text-white hover:bg-[#1B5E43] flex items-center justify-center transition-colors focus:outline-none"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-[#1C443C] bg-gradient-to-t from-[#0C1F1F] to-[#102A2A] p-3.5 transition-all">
      {/* Solar Panel & Sunset Photorealistic Visual Treatment */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 shadow-inner group">
        {/* CSS Visual Artwork of Solar Installation under golden sunset */}
        <div className="h-24 w-full bg-gradient-to-b from-[#193d35] via-[#21493f] to-[#0d2621] relative flex flex-col justify-end p-2.5 overflow-hidden">
          {/* Sun Glow Behind Mountains / Panels */}
          <div className="absolute top-1 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 blur-[6px] opacity-80" />
          
          {/* Stylized Solar Panels Grid Pattern */}
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#34d399_1px,transparent_1px),linear-gradient(to_bottom,#34d399_1px,transparent_1px)] bg-[size:14px_10px] [transform:perspective(120px)_rotateX(25deg)] origin-bottom" />
          
          {/* Subtle Silhouette Skyline */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#091815] to-transparent" />

          {/* Tagline Treatment from UI References */}
          <div className="relative z-10 flex flex-col drop-shadow-md">
            <span className="text-xs font-medium text-emerald-300 italic tracking-wide flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400 fill-emerald-400/40 inline" />
              Go Green...
            </span>
            <span className="text-sm font-extrabold text-[#F4B740] tracking-wider drop-shadow-sm flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline animate-pulse" />
              Go Solar...
            </span>
          </div>
        </div>
      </div>

      {/* Version & Support Quick Bar */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-400/70 px-0.5">
        <span className="font-mono">v1.0.0-prod</span>
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Support</span>
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { getStatusConfig } from "@/config/status-config";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string | null | undefined;
  type?: string;
  className?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  label?: string;
}

export function StatusBadge({
  status,
  className,
  showDot = false,
  size = "sm",
  label,
}: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-md border tracking-wide select-none",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      {showDot && config.dotColor && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotColor)} />
      )}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}

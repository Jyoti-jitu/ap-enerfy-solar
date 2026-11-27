"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatGridProps {
  children: ReactNode;
  columns?: 3 | 4 | 5 | 6;
  className?: string;
}

export function StatGrid({
  children,
  columns = 4,
  className,
}: StatGridProps) {
  const getColClass = () => {
    switch (columns) {
      case 3:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5";
      case 4:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5";
      case 5:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4";
      case 6:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-3.5";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5";
    }
  };

  return <div className={cn(getColClass(), "mb-6", className)}>{children}</div>;
}

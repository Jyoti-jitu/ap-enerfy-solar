"use client";

import React, { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode[];
  filters?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  showBreadcrumbs = false,
  primaryAction,
  secondaryActions = [],
  filters,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-3 mb-6", className)}>
      {showBreadcrumbs && <Breadcrumbs />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Description */}
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Controls & Filters */}
        {(primaryAction || secondaryActions.length > 0 || filters) && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {filters && <div className="flex items-center">{filters}</div>}

            {secondaryActions.map((action, i) => (
              <React.Fragment key={i}>{action}</React.Fragment>
            ))}

            {primaryAction && <div className="flex items-center">{primaryAction}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

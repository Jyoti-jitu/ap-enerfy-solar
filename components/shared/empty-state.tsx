"use client";

import React, { ReactNode } from "react";
import { FolderSearch, Plus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon | ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  className?: string;
}

export function EmptyState({
  title = "No records found",
  description = "Get started by creating your first entry or adjust your search filters.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function") {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-7 h-7" />;
    }
    return <FolderSearch className="w-7 h-7 text-emerald-700" />;
  };

  return (
    <div
      className={cn(
        "py-16 px-4 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-xs",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs mb-3.5">
        {renderIcon()}
      </div>

      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
        >
          {action.icon ? <action.icon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}

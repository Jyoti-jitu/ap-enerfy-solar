"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatVariant = "green" | "blue" | "amber" | "purple" | "red" | "cyan" | "white";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | ReactNode;
  variant?: StatVariant;
  trend?: {
    value: string | number;
    label?: string;
    isPositive?: boolean;
    direction?: "up" | "down" | "neutral";
  };
  description?: string;
  loading?: boolean;
  href?: string;
  className?: string;
}

const VARIANT_STYLES: Record<
  StatVariant,
  { cardBg: string; border: string; iconBg: string; iconText: string }
> = {
  green: {
    cardBg: "bg-[#EAF7EE]",
    border: "border-emerald-200/60",
    iconBg: "bg-emerald-100/80",
    iconText: "text-emerald-700",
  },
  blue: {
    cardBg: "bg-[#EFF6FF]",
    border: "border-blue-200/60",
    iconBg: "bg-blue-100/80",
    iconText: "text-blue-700",
  },
  amber: {
    cardBg: "bg-[#FEF8EC]",
    border: "border-amber-200/60",
    iconBg: "bg-amber-100/80",
    iconText: "text-amber-700",
  },
  purple: {
    cardBg: "bg-[#F4F0FF]",
    border: "border-purple-200/60",
    iconBg: "bg-purple-100/80",
    iconText: "text-purple-700",
  },
  red: {
    cardBg: "bg-[#FEF2F2]",
    border: "border-rose-200/60",
    iconBg: "bg-rose-100/80",
    iconText: "text-rose-700",
  },
  cyan: {
    cardBg: "bg-[#ECFEFF]",
    border: "border-cyan-200/60",
    iconBg: "bg-cyan-100/80",
    iconText: "text-cyan-700",
  },
  white: {
    cardBg: "bg-white",
    border: "border-slate-200",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
  },
};

export function StatCard({
  title,
  value,
  icon,
  variant = "white",
  trend,
  description,
  loading = false,
  href,
  className,
}: StatCardProps) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.white;

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 animate-pulse bg-white border-slate-200 shadow-xs",
          className
        )}
      >
        <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/2" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function") {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
    return null;
  };

  const cardContent = (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 transition-all duration-200 shadow-xs",
        styles.cardBg,
        styles.border,
        href ? "hover:shadow-md hover:border-emerald-300 cursor-pointer" : "",
        className
      )}
    >
      {/* Circular / Rounded Icon Backdrop */}
      <div
        className={cn(
          "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs transition-transform group-hover:scale-105",
          styles.iconBg,
          styles.iconText
        )}
      >
        {renderIcon()}
      </div>

      {/* Metrics & Labels */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-[13px] font-medium text-slate-600 truncate leading-snug">
          {title}
        </p>

        <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight leading-tight mt-1 tabular-nums">
          {value}
        </h3>

        {/* Trend Indicator or Description */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold text-[11px] sm:text-xs",
                trend.isPositive !== false && trend.direction !== "down"
                  ? "text-emerald-700"
                  : "text-rose-600"
              )}
            >
              {trend.direction === "up" || (trend.isPositive !== false && trend.direction !== "down") ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}

          {trend?.label && (
            <span className="text-[11px] text-slate-500 font-normal truncate">
              {trend.label}
            </span>
          )}

          {!trend && description && (
            <span className="text-[11px] text-slate-500 font-normal truncate">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

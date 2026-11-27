import React from "react";
import { cn } from "@/lib/utils";
import { SolarPanelIcon } from "./icons/solar-panel-icon";
import {
  IndianRupee,
  Users,
  Sun,
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Warehouse,
  Percent,
  Calendar,
  Layers,
  HardHat,
  TrendingUp,
  Package,
} from "lucide-react";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  subtextColor?: "emerald" | "blue" | "amber" | "rose" | "neutral";
  change?: string;
  isPositive?: boolean;
  theme?: "green" | "blue" | "yellow" | "purple" | "rose" | "emerald";
  iconName?: string;
  className?: string;
}

const themeStyles = {
  green: {
    bg: "bg-[#edf8f3] border-[#d2f0df]",
    iconBg: "bg-[#d8f4e5] text-[#059669]",
    badgeText: "text-[#059669]",
  },
  emerald: {
    bg: "bg-[#edf8f3] border-[#d2f0df]",
    iconBg: "bg-[#d8f4e5] text-[#059669]",
    badgeText: "text-[#059669]",
  },
  blue: {
    bg: "bg-[#eff6fd] border-[#d7e8fa]",
    iconBg: "bg-[#ddecfa] text-[#2563eb]",
    badgeText: "text-[#2563eb]",
  },
  yellow: {
    bg: "bg-[#fef9eb] border-[#fcefc6]",
    iconBg: "bg-[#fdf2cd] text-[#d97706]",
    badgeText: "text-[#d97706]",
  },
  purple: {
    bg: "bg-[#f5f2fe] border-[#e7defd]",
    iconBg: "bg-[#ece3fc] text-[#7c3aed]",
    badgeText: "text-[#7c3aed]",
  },
  rose: {
    bg: "bg-[#fdf2f4] border-[#fbd8de]",
    iconBg: "bg-[#fcdde3] text-[#e11d48]",
    badgeText: "text-[#e11d48]",
  },
};

export function KPICard({
  title,
  value,
  subtext,
  subtextColor,
  change,
  isPositive = true,
  theme = "green",
  iconName = "IndianRupee",
  className,
}: KPICardProps) {
  const styles = themeStyles[theme] || themeStyles.green;

  const renderIcon = () => {
    const props = { className: "h-5 w-5" };
    switch (iconName.toLowerCase()) {
      case "indianrupee":
      case "rupee":
        return <IndianRupee {...props} />;
      case "users":
      case "user":
        return <Users {...props} />;
      case "solar":
      case "solarpanel":
        return <SolarPanelIcon {...props} />;
      case "sun":
        return <Sun {...props} />;
      case "wrench":
      case "service":
        return <Wrench {...props} />;
      case "alert":
      case "alertcircle":
        return <AlertCircle {...props} />;
      case "clock":
        return <Clock {...props} />;
      case "check":
      case "checkcircle":
        return <CheckCircle2 {...props} />;
      case "x":
      case "xcircle":
        return <XCircle {...props} />;
      case "filetext":
      case "invoice":
        return <FileText {...props} />;
      case "send":
        return <Send {...props} />;
      case "warehouse":
      case "building":
        return <Warehouse {...props} />;
      case "percent":
        return <Percent {...props} />;
      case "calendar":
        return <Calendar {...props} />;
      case "layers":
      case "projects":
        return <Layers {...props} />;
      case "hardhat":
        return <HardHat {...props} />;
      case "package":
        return <Package {...props} />;
      default:
        return <TrendingUp {...props} />;
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-xl border p-5 transition-all duration-200 hover:shadow-sm",
        styles.bg,
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105",
          styles.iconBg
        )}
      >
        {renderIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 truncate">{title}</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 truncate">
          {value}
        </p>

        {(change || subtext) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {change && (
              <span
                className={cn(
                  "font-bold",
                  isPositive ? "text-emerald-800" : "text-rose-700"
                )}
              >
                {change}
              </span>
            )}
            {subtext && (
              <span
                className={cn(
                  "truncate font-medium",
                  subtextColor === "emerald"
                    ? "text-emerald-800"
                    : subtextColor === "rose"
                    ? "text-rose-700"
                    : subtextColor === "amber"
                    ? "text-amber-800"
                    : subtextColor === "blue"
                    ? "text-blue-800"
                    : "text-slate-800"
                )}
              >
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

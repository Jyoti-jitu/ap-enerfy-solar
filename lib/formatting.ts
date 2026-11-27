/**
 * Centralized formatting utilities for AP Enerfy Solar
 * Enforces Indian localization (en-IN), currency formatting (INR ₹),
 * Asia/Kolkata timezone, solar capacity units (kW, MW), and financial years.
 */

/**
 * Format numerical amount to Indian Rupees (INR)
 * e.g. 2480000 -> ₹ 24,80,000
 */
export function formatINR(
  amount: number | string | null | undefined,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "₹ 0";
  }

  const num = Number(amount);
  const showSymbol = options?.showSymbol !== false;
  const symbol = showSymbol ? "₹ " : "";

  if (options?.compact) {
    const abs = Math.abs(num);
    if (abs >= 10000000) {
      return `${symbol}${(num / 10000000).toFixed(options.decimals ?? 2)} Cr`;
    }
    if (abs >= 100000) {
      return `${symbol}${(num / 100000).toFixed(options.decimals ?? 1)} L`;
    }
    if (abs >= 1000) {
      return `${symbol}${(num / 1000).toFixed(options.decimals ?? 1)} k`;
    }
  }

  const parts = num.toFixed(options?.decimals ?? 0).split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 && options?.decimals ? "." + parts[1] : "";

  // Indian number grouping logic
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `${symbol}${formattedInteger}${decimalPart}`;
}

/**
 * Format number with Indian comma grouping
 * e.g. 132000 -> 1,32,000
 */
export function formatIndianNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || isNaN(Number(num))) return "0";
  return Number(num).toLocaleString("en-IN");
}

/**
 * Format Solar Capacity with appropriate unit (W, kW, MW)
 * e.g. 3 -> 3 kW, 186 -> 186 kW, 2500 -> 2.5 MW
 */
export function formatCapacity(
  capacityKw: number | string | null | undefined,
  decimals = 1
): string {
  if (capacityKw === null || capacityKw === undefined || isNaN(Number(capacityKw))) {
    return "0 kW";
  }
  const kw = Number(capacityKw);
  if (kw >= 1000) {
    return `${(kw / 1000).toFixed(decimals)} MW`;
  }
  if (kw < 1 && kw > 0) {
    return `${Math.round(kw * 1000)} W`;
  }
  return `${kw % 1 === 0 ? kw : kw.toFixed(decimals)} kW`;
}

/**
 * Format Indian Financial Year (April - March)
 * e.g. for Jan 2025 -> "FY 2024–25" or "2024 – 2025"
 */
export function formatFinancialYear(date = new Date(), format: "short" | "long" = "short"): string {
  const d = new Date(date);
  const month = d.getMonth(); // 0 is January
  const year = d.getFullYear();

  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;

  if (format === "long") {
    return `${startYear} – ${endYear}`;
  }
  return `FY ${startYear}–${String(endYear).slice(-2)}`;
}

/**
 * Format Date in Indian business format
 * e.g. "Jan 29, 2025"
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      ...options,
    });
  } catch {
    return "—";
  }
}

/**
 * Format Date and Time
 * e.g. "Jan 29, 2025, 04:30 PM"
 */
export function formatDateTime(date: string | number | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

/**
 * Format relative time (e.g. "10 mins ago", "1 hour ago", "Yesterday")
 */
export function formatRelativeTime(date: string | number | Date | null | undefined): string {
  if (!date) return "";
  try {
    const d = new Date(date);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ${Math.floor(diffSec / 3600) === 1 ? "hour" : "hours"} ago`;
    if (diffSec < 172800) return "Yesterday";
    return formatDate(d);
  } catch {
    return "";
  }
}

/**
 * Format percentage with positive/negative indicator
 * e.g. +12.5%, -5.1%
 */
export function formatPercentage(pct: number | string | null | undefined, showPlus = true): string {
  if (pct === null || pct === undefined || isNaN(Number(pct))) return "0%";
  const num = Number(pct);
  const sign = num > 0 && showPlus ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
}

/**
 * Extract user initials (max 2 characters)
 * e.g. "AP Enerfy" -> "AP", "Rajesh Patil" -> "RP"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "AP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format file size in readable units (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

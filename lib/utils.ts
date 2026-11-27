import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian numbering system (e.g. ₹ 24,80,000)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "₹ 0";
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Format currency in compact Indian notation (e.g. ₹ 24.9L, ₹ 1.2Cr)
 */
export function formatCompactCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "₹ 0";
  }
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹ ${(num / 1000).toFixed(1)}k`;
  }
  return `₹ ${num.toFixed(0)}`;
}

/**
 * Format date in standard Indian business format: "Jan 29, 2025"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Calculate financial year string (e.g., "2024-2025" or "2025-2026")
 */
export function getFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  if (month >= 3) { // April onwards
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

/**
 * Safe numeric calculation helper
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const INVOICE_COLORS = {
  primaryGreen: "#145C32",
  secondaryGreen: "#559C32",
  solarYellow: "#FFC107",
  lightGreen: "#E8F3E5",
  textDark: "#172B2A",
  textMuted: "#4B5563",
  border: "#D5E0D5",
  borderDark: "#9CA3AF",
  bgMuted: "#F9FAFB",
};

export function formatINR(amount: number | string | undefined | null): string {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount || 0);
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

import React from "react";
import { Sun, Sparkles } from "lucide-react";

export function InvoiceFooter() {
  return (
    <div className="mt-3 pt-2 border-t border-[#D5E0D5] text-center text-[8.5px] text-[#6B7280]">
      <div className="flex items-center justify-center gap-1.5 text-[#145C32] font-semibold mb-0.5">
        <Sun className="w-3 h-3 text-[#FFC107] fill-current" />
        <span>Thank you for choosing AP Enerfy Solar! Empowering a greener, sustainable future.</span>
        <Sparkles className="w-3 h-3 text-[#FFC107]" />
      </div>
      <p className="text-[8px] text-[#9CA3AF]">
        This is a computer-generated GST tax invoice issued in accordance with the Central Goods and Services Tax Act, 2017.
      </p>
      <div className="mt-1 h-1 w-full bg-gradient-to-r from-[#145C32] via-[#559C32] via-[#FFC107] to-[#145C32] rounded-full opacity-80" />
    </div>
  );
}

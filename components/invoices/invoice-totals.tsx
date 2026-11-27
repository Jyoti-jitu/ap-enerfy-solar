import React from "react";
import { InvoiceCalculationResult } from "@/lib/invoices/calculate-invoice";
import { formatINR } from "./invoice-constants";

interface InvoiceTotalsProps {
  calculations: InvoiceCalculationResult;
  isInterState?: boolean;
}

export function InvoiceTotals({ calculations, isInterState = false }: InvoiceTotalsProps) {
  return (
    <div className="border border-[#D5E0D5] rounded-md overflow-hidden bg-white text-[10px]">
      <div className="bg-[#145C32] text-white px-3 py-1 font-extrabold uppercase tracking-wider text-[9.5px]">
        Financial Summary
      </div>

      <div className="p-2 space-y-1.5">
        <div className="flex justify-between items-center text-[#4B5563]">
          <span>Gross Total:</span>
          <span className="font-mono text-[#172B2A]">{formatINR(calculations.grossAmount)}</span>
        </div>

        {calculations.totalDiscount > 0 && (
          <div className="flex justify-between items-center text-[#16A34A]">
            <span>Less: Discount</span>
            <span className="font-mono">- {formatINR(calculations.totalDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center font-semibold text-[#172B2A] pt-1 border-t border-[#E5E7EB]">
          <span>Taxable Value:</span>
          <span className="font-mono">{formatINR(calculations.taxableAmount)}</span>
        </div>

        {!isInterState ? (
          <>
            <div className="flex justify-between items-center text-[#4B5563]">
              <span>Add: Central GST (CGST)</span>
              <span className="font-mono text-[#172B2A]">{formatINR(calculations.cgstAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-[#4B5563]">
              <span>Add: State GST (SGST)</span>
              <span className="font-mono text-[#172B2A]">{formatINR(calculations.sgstAmount)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center text-[#4B5563]">
            <span>Add: Integrated GST (IGST)</span>
            <span className="font-mono text-[#172B2A]">{formatINR(calculations.igstAmount)}</span>
          </div>
        )}

        {calculations.additionalCharges > 0 && (
          <div className="flex justify-between items-center text-[#4B5563]">
            <span>Freight / BOS Charges:</span>
            <span className="font-mono text-[#172B2A]">{formatINR(calculations.additionalCharges)}</span>
          </div>
        )}

        {calculations.roundOff !== 0 && (
          <div className="flex justify-between items-center text-[#6B7280] text-[9px]">
            <span>Round-off Adjustment:</span>
            <span className="font-mono">
              {calculations.roundOff > 0 ? `+${calculations.roundOff.toFixed(2)}` : calculations.roundOff.toFixed(2)}
            </span>
          </div>
        )}

        {/* Grand Total Highlight */}
        <div className="flex justify-between items-center bg-[#E8F3E5] px-2.5 py-1.5 rounded border border-[#559C32] font-extrabold text-[12px] text-[#145C32] mt-1.5">
          <span>Grand Total:</span>
          <span className="font-mono text-[13px]">{formatINR(calculations.grandTotal)}</span>
        </div>

        {/* Payment info */}
        <div className="pt-1 border-t border-[#E5E7EB] space-y-1 text-[9.5px]">
          <div className="flex justify-between items-center text-[#4B5563]">
            <span>Amount Received / Paid:</span>
            <span className="font-mono font-semibold text-[#16A34A]">{formatINR(calculations.paidAmount)}</span>
          </div>

          <div className="flex justify-between items-center font-bold">
            <span className={calculations.balanceAmount > 0 ? "text-[#B91C1C]" : "text-[#145C32]"}>
              Outstanding Balance Due:
            </span>
            <span
              className={`font-mono text-[11px] ${
                calculations.balanceAmount > 0 ? "text-[#B91C1C]" : "text-[#145C32]"
              }`}
            >
              {formatINR(calculations.balanceAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

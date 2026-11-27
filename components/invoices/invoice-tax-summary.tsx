import React from "react";
import { HsnSummaryRow } from "@/lib/invoices/calculate-invoice";
import { formatINR } from "./invoice-constants";

interface InvoiceTaxSummaryProps {
  hsnSummary: HsnSummaryRow[];
  isInterState?: boolean;
}

export function InvoiceTaxSummary({ hsnSummary, isInterState = false }: InvoiceTaxSummaryProps) {
  if (!hsnSummary || hsnSummary.length === 0) return null;

  const totalTaxable = hsnSummary.reduce((s, r) => s + r.taxableAmount, 0);
  const totalCgst = hsnSummary.reduce((s, r) => s + r.cgstAmount, 0);
  const totalSgst = hsnSummary.reduce((s, r) => s + r.sgstAmount, 0);
  const totalIgst = hsnSummary.reduce((s, r) => s + r.igstAmount, 0);
  const grandTax = hsnSummary.reduce((s, r) => s + r.totalTax, 0);

  return (
    <div className="border border-[#D5E0D5] rounded-md overflow-hidden text-[9px]">
      <div className="bg-[#E8F3E5] px-2.5 py-1 border-b border-[#D5E0D5] font-bold text-[#145C32] uppercase tracking-wider text-[9px] flex items-center justify-between">
        <span>GST Tax Breakdown Summary</span>
        <span className="text-[8.5px] font-medium text-[#4B5563]">
          {isInterState ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)"}
        </span>
      </div>

      <table className="w-full text-center border-collapse">
        <thead className="bg-[#F9FAFB] text-[#4B5563] font-semibold border-b border-[#D5E0D5]">
          <tr>
            <th className="py-1 px-1.5 border-r border-[#E5E7EB] text-left">HSN/SAC</th>
            <th className="py-1 px-1.5 border-r border-[#E5E7EB] text-right">Taxable Val (₹)</th>
            {!isInterState ? (
              <>
                <th className="py-1 px-1 border-r border-[#E5E7EB] w-12">CGST %</th>
                <th className="py-1 px-1.5 border-r border-[#E5E7EB] text-right">CGST (₹)</th>
                <th className="py-1 px-1 border-r border-[#E5E7EB] w-12">SGST %</th>
                <th className="py-1 px-1.5 border-r border-[#E5E7EB] text-right">SGST (₹)</th>
              </>
            ) : (
              <>
                <th className="py-1 px-1 border-r border-[#E5E7EB] w-12">IGST %</th>
                <th className="py-1 px-1.5 border-r border-[#E5E7EB] text-right">IGST (₹)</th>
              </>
            )}
            <th className="py-1 px-1.5 text-right">Total Tax (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB] text-[#172B2A]">
          {hsnSummary.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}>
              <td className="py-1 px-1.5 text-left font-mono font-medium border-r border-[#E5E7EB]">
                {row.hsnCode}
              </td>
              <td className="py-1 px-1.5 text-right font-mono border-r border-[#E5E7EB]">
                {row.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              {!isInterState ? (
                <>
                  <td className="py-1 px-1 border-r border-[#E5E7EB] text-[#6B7280]">{row.cgstRate}%</td>
                  <td className="py-1 px-1.5 text-right font-mono border-r border-[#E5E7EB]">
                    {row.cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-1 px-1 border-r border-[#E5E7EB] text-[#6B7280]">{row.sgstRate}%</td>
                  <td className="py-1 px-1.5 text-right font-mono border-r border-[#E5E7EB]">
                    {row.sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </>
              ) : (
                <>
                  <td className="py-1 px-1 border-r border-[#E5E7EB] text-[#6B7280]">{row.igstRate}%</td>
                  <td className="py-1 px-1.5 text-right font-mono border-r border-[#E5E7EB]">
                    {row.igstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </>
              )}
              <td className="py-1 px-1.5 text-right font-mono font-bold text-[#145C32]">
                {row.totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          <tr className="bg-[#E8F3E5]/50 font-bold border-t border-[#D5E0D5]">
            <td className="py-1 px-1.5 text-left text-[#145C32] border-r border-[#D5E0D5]">Total</td>
            <td className="py-1 px-1.5 text-right font-mono border-r border-[#D5E0D5]">
              {totalTaxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
            {!isInterState ? (
              <>
                <td className="py-1 px-1 border-r border-[#D5E0D5]"></td>
                <td className="py-1 px-1.5 text-right font-mono border-r border-[#D5E0D5]">
                  {totalCgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-1 px-1 border-r border-[#D5E0D5]"></td>
                <td className="py-1 px-1.5 text-right font-mono border-r border-[#D5E0D5]">
                  {totalSgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
              </>
            ) : (
              <>
                <td className="py-1 px-1 border-r border-[#D5E0D5]"></td>
                <td className="py-1 px-1.5 text-right font-mono border-r border-[#D5E0D5]">
                  {totalIgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
              </>
            )}
            <td className="py-1 px-1.5 text-right font-mono text-[#145C32]">
              {grandTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import { CalculatedLineItem } from "@/lib/invoices/calculate-invoice";
import { formatINR } from "./invoice-constants";

interface InvoiceItemsTableProps {
  items: CalculatedLineItem[];
  isInterState?: boolean;
}

export function InvoiceItemsTable({ items, isInterState = false }: InvoiceItemsTableProps) {
  return (
    <div className="mb-3 overflow-hidden rounded-md border border-[#D5E0D5]">
      <table className="w-full border-collapse text-[9.5px]">
        <thead>
          <tr className="bg-[#145C32] text-white font-bold text-[9px] uppercase tracking-wider">
            <th className="py-1.5 px-2 text-center w-8 border-r border-[#1e6f3f]">#</th>
            <th className="py-1.5 px-2 text-left border-r border-[#1e6f3f]">
              Description of Goods / Services
            </th>
            <th className="py-1.5 px-2 text-center w-16 border-r border-[#1e6f3f]">HSN/SAC</th>
            <th className="py-1.5 px-2 text-center w-10 border-r border-[#1e6f3f]">Qty</th>
            <th className="py-1.5 px-2 text-center w-12 border-r border-[#1e6f3f]">Unit</th>
            <th className="py-1.5 px-2 text-right w-16 border-r border-[#1e6f3f]">Rate (₹)</th>
            <th className="py-1.5 px-2 text-right w-14 border-r border-[#1e6f3f]">Disc (₹)</th>
            <th className="py-1.5 px-2 text-right w-20 border-r border-[#1e6f3f]">Taxable (₹)</th>
            <th className="py-1.5 px-2 text-center w-12 border-r border-[#1e6f3f]">GST %</th>
            <th className="py-1.5 px-2 text-right w-24">Total (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB] text-[#172B2A]">
          {items.map((item, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
            >
              <td className="py-1.5 px-2 text-center font-semibold text-[#6B7280] border-r border-[#E5E7EB]">
                {item.slNo || idx + 1}
              </td>
              <td className="py-1.5 px-2 text-left font-medium border-r border-[#E5E7EB] leading-tight">
                <div>{item.description}</div>
              </td>
              <td className="py-1.5 px-2 text-center font-mono text-[9px] border-r border-[#E5E7EB] text-[#4B5563]">
                {item.hsnCode}
              </td>
              <td className="py-1.5 px-2 text-center font-bold border-r border-[#E5E7EB]">
                {item.quantity}
              </td>
              <td className="py-1.5 px-2 text-center text-[#6B7280] border-r border-[#E5E7EB]">
                {item.unit}
              </td>
              <td className="py-1.5 px-2 text-right font-mono border-r border-[#E5E7EB]">
                {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="py-1.5 px-2 text-right font-mono border-r border-[#E5E7EB] text-[#6B7280]">
                {item.discount > 0 ? item.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}
              </td>
              <td className="py-1.5 px-2 text-right font-mono font-medium border-r border-[#E5E7EB]">
                {item.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="py-1.5 px-2 text-center font-semibold text-[#145C32] border-r border-[#E5E7EB]">
                {item.gstRate}%
              </td>
              <td className="py-1.5 px-2 text-right font-mono font-bold text-[#145C32]">
                {formatINR(item.totalAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

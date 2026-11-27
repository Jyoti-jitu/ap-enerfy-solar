import React from "react";

interface InvoiceAmountInWordsProps {
  amountInWords: string;
}

export function InvoiceAmountInWords({ amountInWords }: InvoiceAmountInWordsProps) {
  return (
    <div className="mb-3 px-3 py-1.5 bg-[#F9FAFB] border border-[#D5E0D5] rounded-md text-[9.5px] leading-relaxed">
      <span className="font-bold text-[#145C32] uppercase tracking-wider">
        Amount Chargeable (in words):{" "}
      </span>
      <span className="font-semibold text-[#172B2A] italic">
        {amountInWords}
      </span>
    </div>
  );
}

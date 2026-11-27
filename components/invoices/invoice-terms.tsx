import React from "react";

interface InvoiceTermsProps {
  terms: string[];
  notes?: string;
}

export function InvoiceTerms({ terms, notes }: InvoiceTermsProps) {
  return (
    <div className="border border-[#D5E0D5] rounded-md p-2 bg-white text-[8.5px] text-[#4B5563] flex-1">
      <p className="font-extrabold uppercase tracking-wider text-[#145C32] text-[9px] mb-1">
        Terms & Conditions
      </p>
      <ul className="space-y-0.5 list-none">
        {terms.map((t, idx) => (
          <li key={idx} className="leading-tight">
            {t}
          </li>
        ))}
      </ul>
      {notes && (
        <div className="mt-1.5 pt-1 border-t border-[#E5E7EB] text-[#172B2A]">
          <span className="font-bold text-[#145C32]">Special Note:</span> {notes}
        </div>
      )}
    </div>
  );
}
